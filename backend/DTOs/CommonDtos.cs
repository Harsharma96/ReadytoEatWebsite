using System.Text.Json.Serialization;
using FoodEat.Api.Models;

namespace FoodEat.Api.DTOs;

public class ApiResponse<T>
{
    [JsonPropertyName("success")]
    public bool Success { get; set; } = true;

    [JsonPropertyName("message")]
    public string? Message { get; set; }

    [JsonPropertyName("data")]
    public T? Data { get; set; }
}

public class ProductListResponse
{
    [JsonPropertyName("success")]
    public bool Success { get; set; } = true;

    [JsonPropertyName("count")]
    public int Count { get; set; }

    [JsonPropertyName("products")]
    public List<Product> Products { get; set; } = new();
}

public class ValidatePromoRequest
{
    [JsonPropertyName("code")]
    public string Code { get; set; } = string.Empty;

    [JsonPropertyName("subtotal")]
    public double Subtotal { get; set; }
}

public class ValidatePromoResponse
{
    [JsonPropertyName("success")]
    public bool Success { get; set; } = true;

    [JsonPropertyName("valid")]
    public bool Valid { get; set; }

    [JsonPropertyName("discount")]
    public double Discount { get; set; }

    [JsonPropertyName("message")]
    public string Message { get; set; } = string.Empty;
}

public class AdminStatsResponse
{
    [JsonPropertyName("success")]
    public bool Success { get; set; } = true;

    [JsonPropertyName("stats")]
    public AdminOverviewStats Stats { get; set; } = new();

    [JsonPropertyName("orders")]
    public List<Order> Orders { get; set; } = new();

    [JsonPropertyName("inquiries")]
    public List<ContactInquiry> Inquiries { get; set; } = new();

    [JsonPropertyName("subscribers")]
    public List<NewsletterSubscriber> Subscribers { get; set; } = new();

    [JsonPropertyName("promos")]
    public List<PromoCode> Promos { get; set; } = new();

    [JsonPropertyName("reviews")]
    public List<FeedbackReview>? Reviews { get; set; }
}

public class AdminOverviewStats
{
    [JsonPropertyName("totalOrders")]
    public int TotalOrders { get; set; }

    [JsonPropertyName("activeOrders")]
    public int ActiveOrders { get; set; }

    [JsonPropertyName("completedOrders")]
    public int CompletedOrders { get; set; }

    [JsonPropertyName("totalRevenue")]
    public double TotalRevenue { get; set; }

    [JsonPropertyName("averageOrderValue")]
    public double AverageOrderValue { get; set; }

    [JsonPropertyName("totalSubscribers")]
    public int TotalSubscribers { get; set; }

    [JsonPropertyName("totalInquiries")]
    public int TotalInquiries { get; set; }

    [JsonPropertyName("totalPromos")]
    public int TotalPromos { get; set; }

    [JsonPropertyName("totalReviews")]
    public int TotalReviews { get; set; }

    [JsonPropertyName("averageRating")]
    public double AverageRating { get; set; }
}

public class SyncCartRequest
{
    [JsonPropertyName("guestId")]
    public string? GuestId { get; set; }

    [JsonPropertyName("items")]
    public List<OrderItem> Items { get; set; } = new();
}
