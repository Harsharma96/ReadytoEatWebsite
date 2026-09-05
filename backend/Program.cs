using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using FoodEat.Api.Data;
using FoodEat.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// ==================== 1. SERVICES & DI ====================

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });

builder.Services.AddSingleton<JsonDataStore>();

builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IPaymentService, PaymentService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IPromoService, PromoService>();
builder.Services.AddScoped<IAdminService, AdminService>();

// ==================== 2. JWT AUTHENTICATION ====================

var jwtKey = builder.Configuration["Jwt:SecretKey"] ?? "foodeat_luxury_secret_jwt_key_2026_super_secure_key_32_chars!";
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "FoodEat.Api";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "FoodEat.Client";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
        ValidateIssuer = true,
        ValidIssuer = jwtIssuer,
        ValidateAudience = true,
        ValidAudience = jwtAudience,
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy => policy.RequireRole("admin"));
});

// ==================== 3. CORS POLICY ====================

builder.Services.AddCors(options =>
{
    options.AddPolicy("FoodEatCorsPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:3001")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
        policy.SetIsOriginAllowed(_ => true)
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// ==================== 4. SWAGGER / OPENAPI ====================

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "FoodEat Royal API (.NET Web API)",
        Version = "v1",
        Description = "Enterprise RESTful Web API for FoodEat Food Ordering, Payment Processing, and Admin Ledger Platform."
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// ==================== 4.5. PERFORMANCE (COMPRESSION & CACHING) ====================
builder.Services.AddResponseCompression(options =>
{
    options.EnableForHttps = true;
    options.Providers.Add<Microsoft.AspNetCore.ResponseCompression.BrotliCompressionProvider>();
    options.Providers.Add<Microsoft.AspNetCore.ResponseCompression.GzipCompressionProvider>();
});
builder.Services.AddResponseCaching();

var app = builder.Build();

// ==================== 5. HTTP REQUEST PIPELINE ====================

app.UseResponseCompression();

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "FoodEat API v1");
    c.RoutePrefix = "swagger";
});

app.UseCors("FoodEatCorsPolicy");
app.UseResponseCaching();

app.UseAuthentication();
app.UseAuthorization();

// Root health check endpoint
app.MapGet("/", () => Results.Ok(new
{
    name = "FoodEat Royal API",
    version = "1.0.0",
    engine = ".NET 9 Web API",
    status = "healthy",
    swaggerDocs = "/swagger",
    timestamp = DateTime.UtcNow.ToString("o")
}));

app.MapGet("/api/health", () => Results.Ok(new
{
    status = "healthy",
    timestamp = DateTime.UtcNow.ToString("o")
}));

app.MapControllers();

app.Run();
