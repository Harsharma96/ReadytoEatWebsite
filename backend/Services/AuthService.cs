using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Collections.Concurrent;
using Microsoft.IdentityModel.Tokens;
using FoodEat.Api.Data;
using FoodEat.Api.DTOs;
using FoodEat.Api.Models;

namespace FoodEat.Api.Services;

public interface IAuthService
{
    Task<AuthResponse> RegisterAsync(RegisterRequest request);
    Task<AuthResponse> LoginAsync(LoginRequest request);
    Task<AuthResponse> AdminLoginAsync(LoginRequest request, string clientIp);
    Task<UserDto?> GetProfileAsync(string userId);
    Task<AuthResponse> ForgotPasswordAsync(ForgotPasswordRequest request);
    Task<AuthResponse> VerifyOtpAsync(VerifyOtpRequest request);
    Task<AuthResponse> ResetPasswordAsync(ResetPasswordRequest request);
    string GenerateJwtToken(User user);
}

public class AuthService : IAuthService
{
    private readonly JsonDataStore _store;
    private readonly IConfiguration _config;
    private static readonly ConcurrentDictionary<string, (int Count, DateTime LockedUntil)> _adminLoginAttempts = new();
    private const int MaxAdminAttempts = 5;
    private static readonly TimeSpan LockDuration = TimeSpan.FromMinutes(15);

    public AuthService(JsonDataStore store, IConfiguration config)
    {
        _store = store;
        _config = config;
    }

    public Task<AuthResponse> RegisterAsync(RegisterRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name) || string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
        {
            return Task.FromResult(new AuthResponse { Success = false, Message = "Name, Email, and Password are required." });
        }

        if (request.Password.Length < 6)
        {
            return Task.FromResult(new AuthResponse { Success = false, Message = "Password must be at least 6 characters." });
        }

        var cleanEmail = request.Email.Trim().ToLowerInvariant();

        var existingUser = _store.Read(db => db.Users.FirstOrDefault(u => u.Email.Equals(cleanEmail, StringComparison.OrdinalIgnoreCase)));
        if (existingUser != null)
        {
            return Task.FromResult(new AuthResponse { Success = false, Message = "An account with this email already exists." });
        }

        var hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.Password, 12);
        var newUser = new User
        {
            Id = $"USR-{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds().ToString().Substring(Math.Max(0, DateTimeOffset.UtcNow.ToUnixTimeMilliseconds().ToString().Length - 8))}",
            Name = request.Name.Trim(),
            Email = cleanEmail,
            Password = hashedPassword,
            Phone = request.Phone?.Trim() ?? string.Empty,
            Role = "user",
            Avatar = $"https://ui-avatars.com/api/?name={Uri.EscapeDataString(request.Name.Trim())}&background=FF6B35&color=fff&bold=true&size=128",
            LoyaltyPoints = 50,
            CreatedAt = DateTime.UtcNow.ToString("o"),
            LastLogin = DateTime.UtcNow.ToString("o")
        };

        _store.Update(db => db.Users.Add(newUser));

        var token = GenerateJwtToken(newUser);
        return Task.FromResult(new AuthResponse
        {
            Success = true,
            Message = "Welcome to FoodEat! Your royal account is ready. 🍽️",
            Token = token,
            User = MapToUserDto(newUser)
        });
    }

    public Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
        {
            return Task.FromResult(new AuthResponse { Success = false, Message = "Email and password are required." });
        }

        var cleanEmail = request.Email.Trim().ToLowerInvariant();
        var user = _store.Read(db => db.Users.FirstOrDefault(u => u.Email.Equals(cleanEmail, StringComparison.OrdinalIgnoreCase)));

        if (user == null)
        {
            return Task.FromResult(new AuthResponse { Success = false, Message = "No account found with this email." });
        }

        bool isValid = false;
        try
        {
            isValid = BCrypt.Net.BCrypt.Verify(request.Password, user.Password);
        }
        catch
        {
            isValid = false;
        }

        if (!isValid)
        {
            return Task.FromResult(new AuthResponse { Success = false, Message = "Incorrect password. Please try again." });
        }

        user.LastLogin = DateTime.UtcNow.ToString("o");
        _store.Update(db =>
        {
            var u = db.Users.FirstOrDefault(x => x.Id == user.Id);
            if (u != null) u.LastLogin = user.LastLogin;
        });

        var token = GenerateJwtToken(user);
        return Task.FromResult(new AuthResponse
        {
            Success = true,
            Message = $"Welcome back, {user.Name.Split(' ')[0]}! 👑",
            Token = token,
            User = MapToUserDto(user)
        });
    }

    public Task<AuthResponse> AdminLoginAsync(LoginRequest request, string clientIp)
    {
        var ipKey = string.IsNullOrWhiteSpace(clientIp) ? "unknown" : clientIp;
        var now = DateTime.UtcNow;

        if (_adminLoginAttempts.TryGetValue(ipKey, out var attempt) && attempt.LockedUntil > now)
        {
            var minutesLeft = Math.Ceiling((attempt.LockedUntil - now).TotalMinutes);
            return Task.FromResult(new AuthResponse
            {
                Success = false,
                Message = $"Too many failed attempts. Try again in {minutesLeft} minute(s)."
            });
        }

        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
        {
            return Task.FromResult(new AuthResponse { Success = false, Message = "Email and password are required." });
        }

        var cleanEmail = request.Email.Trim().ToLowerInvariant();
        var user = _store.Read(db => db.Users.FirstOrDefault(u => u.Email.Equals(cleanEmail, StringComparison.OrdinalIgnoreCase)));

        void RecordFail()
        {
            _adminLoginAttempts.AddOrUpdate(ipKey,
                _ => (1, DateTime.MinValue),
                (_, old) =>
                {
                    var newCount = old.Count + 1;
                    if (newCount >= MaxAdminAttempts)
                    {
                        return (0, now.Add(LockDuration));
                    }
                    return (newCount, old.LockedUntil);
                });
        }

        if (user == null || !user.Role.Equals("admin", StringComparison.OrdinalIgnoreCase))
        {
            RecordFail();
            return Task.FromResult(new AuthResponse { Success = false, Message = "Invalid admin credentials." });
        }

        bool isValid = false;
        try
        {
            isValid = BCrypt.Net.BCrypt.Verify(request.Password, user.Password);
        }
        catch
        {
            isValid = false;
        }

        if (!isValid)
        {
            RecordFail();
            return Task.FromResult(new AuthResponse { Success = false, Message = "Incorrect admin password." });
        }

        _adminLoginAttempts.TryRemove(ipKey, out _);

        user.LastLogin = DateTime.UtcNow.ToString("o");
        _store.Update(db =>
        {
            var u = db.Users.FirstOrDefault(x => x.Id == user.Id);
            if (u != null) u.LastLogin = user.LastLogin;
        });

        var token = GenerateJwtToken(user);
        return Task.FromResult(new AuthResponse
        {
            Success = true,
            Message = $"Welcome back, Royal Master Chef {user.Name.Split(' ')[0]}! 👑",
            Token = token,
            User = MapToUserDto(user)
        });
    }

    public Task<UserDto?> GetProfileAsync(string userId)
    {
        var user = _store.Read(db => db.Users.FirstOrDefault(u => u.Id == userId));
        return Task.FromResult(user != null ? MapToUserDto(user) : null);
    }

    public Task<AuthResponse> ForgotPasswordAsync(ForgotPasswordRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email))
        {
            return Task.FromResult(new AuthResponse { Success = false, Message = "Email is required." });
        }

        var cleanEmail = request.Email.Trim().ToLowerInvariant();
        var user = _store.Read(db => db.Users.FirstOrDefault(u => u.Email.Equals(cleanEmail, StringComparison.OrdinalIgnoreCase)));

        if (user == null)
        {
            return Task.FromResult(new AuthResponse
            {
                Success = true,
                Message = "If this email is registered, you'll receive an OTP shortly."
            });
        }

        var randomOtp = new Random().Next(100000, 999999).ToString();
        var expiry = DateTime.UtcNow.AddMinutes(15).ToString("o");

        _store.Update(db =>
        {
            db.PasswordResets.RemoveAll(r => r.Email.Equals(cleanEmail, StringComparison.OrdinalIgnoreCase));
            db.PasswordResets.Add(new PasswordResetRecord
            {
                Email = cleanEmail,
                Otp = randomOtp,
                Expiry = expiry,
                Used = false,
                Verified = false
            });
        });

        return Task.FromResult(new AuthResponse
        {
            Success = true,
            Message = "OTP sent to your email address.",
            DevOtp = randomOtp
        });
    }

    public Task<AuthResponse> VerifyOtpAsync(VerifyOtpRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Otp))
        {
            return Task.FromResult(new AuthResponse { Success = false, Message = "Email and OTP are required." });
        }

        var cleanEmail = request.Email.Trim().ToLowerInvariant();
        var record = _store.Read(db => db.PasswordResets.FirstOrDefault(r => r.Email.Equals(cleanEmail, StringComparison.OrdinalIgnoreCase) && r.Otp == request.Otp.Trim() && !r.Used));

        if (record == null)
        {
            return Task.FromResult(new AuthResponse { Success = false, Message = "Invalid OTP. Please try again." });
        }

        if (DateTime.TryParse(record.Expiry, out var exp) && DateTime.UtcNow > exp)
        {
            return Task.FromResult(new AuthResponse { Success = false, Message = "OTP has expired. Please request a new one." });
        }

        _store.Update(db =>
        {
            var r = db.PasswordResets.FirstOrDefault(x => x.Email.Equals(cleanEmail, StringComparison.OrdinalIgnoreCase) && x.Otp == request.Otp.Trim());
            if (r != null) r.Verified = true;
        });

        return Task.FromResult(new AuthResponse { Success = true, Message = "OTP verified successfully." });
    }

    public Task<AuthResponse> ResetPasswordAsync(ResetPasswordRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Otp) || string.IsNullOrWhiteSpace(request.NewPassword))
        {
            return Task.FromResult(new AuthResponse { Success = false, Message = "Email, OTP, and new password are required." });
        }

        if (request.NewPassword.Length < 6)
        {
            return Task.FromResult(new AuthResponse { Success = false, Message = "Password must be at least 6 characters." });
        }

        var cleanEmail = request.Email.Trim().ToLowerInvariant();
        var record = _store.Read(db => db.PasswordResets.FirstOrDefault(r => r.Email.Equals(cleanEmail, StringComparison.OrdinalIgnoreCase) && r.Otp == request.Otp.Trim() && !r.Used && r.Verified));

        if (record == null)
        {
            return Task.FromResult(new AuthResponse { Success = false, Message = "Invalid or expired reset session." });
        }

        var user = _store.Read(db => db.Users.FirstOrDefault(u => u.Email.Equals(cleanEmail, StringComparison.OrdinalIgnoreCase)));
        if (user == null)
        {
            return Task.FromResult(new AuthResponse { Success = false, Message = "User not found." });
        }

        var newHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword, 12);

        _store.Update(db =>
        {
            var u = db.Users.FirstOrDefault(x => x.Email.Equals(cleanEmail, StringComparison.OrdinalIgnoreCase));
            if (u != null) u.Password = newHash;

            var r = db.PasswordResets.FirstOrDefault(x => x.Email.Equals(cleanEmail, StringComparison.OrdinalIgnoreCase) && x.Otp == request.Otp.Trim());
            if (r != null) r.Used = true;
        });

        return Task.FromResult(new AuthResponse
        {
            Success = true,
            Message = "Password reset successfully! You can now log in. 🎉"
        });
    }

    public string GenerateJwtToken(User user)
    {
        var secretKey = _config["Jwt:SecretKey"] ?? "foodeat_luxury_secret_jwt_key_2026_super_secure_key_32_chars!";
        var issuer = _config["Jwt:Issuer"] ?? "FoodEat.Api";
        var audience = _config["Jwt:Audience"] ?? "FoodEat.Client";
        var expiresDays = int.TryParse(_config["Jwt:ExpiresInDays"], out int days) ? days : 7;

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim("name", user.Name),
            new Claim(ClaimTypes.Role, user.Role),
            new Claim("id", user.Id),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddDays(expiresDays),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private static UserDto MapToUserDto(User user)
    {
        return new UserDto
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            Phone = user.Phone,
            Role = user.Role,
            Avatar = user.Avatar,
            LoyaltyPoints = user.LoyaltyPoints,
            CreatedAt = user.CreatedAt,
            LastLogin = user.LastLogin
        };
    }
}
