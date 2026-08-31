using System.Text.Json.Serialization;

namespace FoodEat.Api.Models;

public class User
{
    [JsonPropertyName("id")]
    public string Id { get; set; } = string.Empty;

    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("email")]
    public string Email { get; set; } = string.Empty;

    [JsonPropertyName("password")]
    public string Password { get; set; } = string.Empty;

    [JsonPropertyName("phone")]
    public string Phone { get; set; } = string.Empty;

    [JsonPropertyName("role")]
    public string Role { get; set; } = "user"; // "user" or "admin"

    [JsonPropertyName("avatar")]
    public string Avatar { get; set; } = string.Empty;

    [JsonPropertyName("loyaltyPoints")]
    public int LoyaltyPoints { get; set; } = 50;

    [JsonPropertyName("createdAt")]
    public string CreatedAt { get; set; } = DateTime.UtcNow.ToString("o");

    [JsonPropertyName("lastLogin")]
    public string? LastLogin { get; set; }
}

public class PasswordResetRecord
{
    [JsonPropertyName("email")]
    public string Email { get; set; } = string.Empty;

    [JsonPropertyName("otp")]
    public string Otp { get; set; } = string.Empty;

    [JsonPropertyName("expiry")]
    public string Expiry { get; set; } = string.Empty;

    [JsonPropertyName("used")]
    public bool Used { get; set; } = false;

    [JsonPropertyName("verified")]
    public bool Verified { get; set; } = false;
}
