using System.Text.Json.Serialization;

namespace FoodEat.Api.Models;

public class ChefSpecialConfig
{
    [JsonPropertyName("id")]
    public string Id { get; set; } = "chef-special-default";

    [JsonPropertyName("productId")]
    public string ProductId { get; set; } = "double-smash-cheese-burger";

    [JsonPropertyName("badgeText")]
    public string BadgeText { get; set; } = "👑 ROYAL CHEF SPECIAL OF THE MONTH";

    [JsonPropertyName("customTitle")]
    public string? CustomTitle { get; set; } = "Nawabi Awadhi Zafrani Handi Dum Biryani";

    [JsonPropertyName("customDescription")]
    public string? CustomDescription { get; set; } = "Curated by Master Ustads of Lucknow. Prime cuts of tender lamb marinated for 48 hours in stone-ground Awadhi spices, layered with aged Basmati rice, infused with Kashmiri saffron milk, and sealed in clay handi for 4 hours of slow charcoal dum cooking.";

    [JsonPropertyName("heritageTag")]
    public string HeritageTag { get; set; } = "Awadh Royals";

    [JsonPropertyName("slowCookingTag")]
    public string SlowCookingTag { get; set; } = "4-Hr Clay Dum";

    [JsonPropertyName("dailyBatchTag")]
    public string DailyBatchTag { get; set; } = "Only 40 Handis";

    [JsonPropertyName("customPrice")]
    public double? CustomPrice { get; set; } = 549;

    [JsonPropertyName("customImage")]
    public string? CustomImage { get; set; } = "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=1200&auto=format&fit=crop";

    [JsonPropertyName("customImages")]
    public List<string>? CustomImages { get; set; } = new()
    {
        "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=1200&auto=format&fit=crop"
    };

    [JsonPropertyName("isActive")]
    public bool IsActive { get; set; } = true;

    [JsonPropertyName("buttonText")]
    public string? ButtonText { get; set; } = "Reserve Royal Handi";

    [JsonPropertyName("product")]
    public Product? Product { get; set; }
}

public class TrendingSpotlightItem
{
    [JsonPropertyName("id")]
    public string Id { get; set; } = string.Empty;

    [JsonPropertyName("productId")]
    public string ProductId { get; set; } = string.Empty;

    [JsonPropertyName("customOfferTag")]
    public string CustomOfferTag { get; set; } = "🔥 TODAY'S POPULAR TRENDING DEAL";

    [JsonPropertyName("offerBadge")]
    public string OfferBadge { get; set; } = "CHEF PICK";

    [JsonPropertyName("discountPercent")]
    public double? DiscountPercent { get; set; }

    [JsonPropertyName("priority")]
    public int Priority { get; set; } = 1;

    [JsonPropertyName("isActive")]
    public bool IsActive { get; set; } = true;

    [JsonPropertyName("createdAt")]
    public string CreatedAt { get; set; } = DateTime.UtcNow.ToString("o");

    [JsonPropertyName("product")]
    public Product? Product { get; set; }
}

public class FeastBoxTier
{
    [JsonPropertyName("id")]
    public string Id { get; set; } = string.Empty;

    [JsonPropertyName("count")]
    public int Count { get; set; }

    [JsonPropertyName("title")]
    public string Title { get; set; } = string.Empty;

    [JsonPropertyName("discountPercent")]
    public double DiscountPercent { get; set; }

    [JsonPropertyName("badge")]
    public string Badge { get; set; } = string.Empty;

    [JsonPropertyName("gift")]
    public string Gift { get; set; } = string.Empty;

    [JsonPropertyName("freeGifts")]
    public List<string> FreeGifts { get; set; } = new();

    [JsonPropertyName("isActive")]
    public bool IsActive { get; set; } = true;
}

public class PromoCode
{
    [JsonPropertyName("code")]
    public string Code { get; set; } = string.Empty;

    [JsonPropertyName("title")]
    public string? Title { get; set; }

    [JsonPropertyName("discountPercent")]
    public double? DiscountPercent { get; set; }

    [JsonPropertyName("fixedDiscount")]
    public double? FixedDiscount { get; set; }

    [JsonPropertyName("minSpend")]
    public double MinSpend { get; set; } = 0;

    [JsonPropertyName("description")]
    public string Description { get; set; } = string.Empty;

    [JsonPropertyName("isActive")]
    public bool IsActive { get; set; } = true;

    [JsonPropertyName("isFlashBanner")]
    public bool? IsFlashBanner { get; set; } = false;

    [JsonPropertyName("freeItem")]
    public string? FreeItem { get; set; }

    [JsonPropertyName("badgeText")]
    public string? BadgeText { get; set; }

    [JsonPropertyName("hoursLeft")]
    public int? HoursLeft { get; set; }

    [JsonPropertyName("bgGradient")]
    public string? BgGradient { get; set; }
}

public class FeedbackReview
{
    [JsonPropertyName("id")]
    public string Id { get; set; } = string.Empty;

    [JsonPropertyName("orderId")]
    public string? OrderId { get; set; }

    [JsonPropertyName("customerName")]
    public string CustomerName { get; set; } = "Verified Guest";

    [JsonPropertyName("userName")]
    public string? UserName { get; set; }

    [JsonPropertyName("rating")]
    public double Rating { get; set; } = 5;

    [JsonPropertyName("title")]
    public string? Title { get; set; } = "Spectacular Taste";

    [JsonPropertyName("moodEmoji")]
    public string MoodEmoji { get; set; } = "👑";

    [JsonPropertyName("deliveryRating")]
    public double DeliveryRating { get; set; } = 5;

    [JsonPropertyName("tasteRating")]
    public double TasteRating { get; set; } = 5;

    [JsonPropertyName("favoriteDish")]
    public string? FavoriteDish { get; set; }

    [JsonPropertyName("tags")]
    public List<string> Tags { get; set; } = new();

    [JsonPropertyName("comment")]
    public string Comment { get; set; } = string.Empty;

    [JsonPropertyName("productId")]
    public string? ProductId { get; set; }

    [JsonPropertyName("createdAt")]
    public string CreatedAt { get; set; } = DateTime.UtcNow.ToString("o");

    [JsonPropertyName("date")]
    public string? Date { get; set; }

    [JsonPropertyName("verified")]
    public bool Verified { get; set; } = true;
}

public class ContactInquiry
{
    [JsonPropertyName("id")]
    public string Id { get; set; } = string.Empty;

    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("email")]
    public string Email { get; set; } = string.Empty;

    [JsonPropertyName("phone")]
    public string? Phone { get; set; }

    [JsonPropertyName("eventType")]
    public string? EventType { get; set; }

    [JsonPropertyName("message")]
    public string Message { get; set; } = string.Empty;

    [JsonPropertyName("createdAt")]
    public string CreatedAt { get; set; } = DateTime.UtcNow.ToString("o");
}

public class NewsletterSubscriber
{
    [JsonPropertyName("email")]
    public string Email { get; set; } = string.Empty;

    [JsonPropertyName("subscribedAt")]
    public string SubscribedAt { get; set; } = DateTime.UtcNow.ToString("o");

    [JsonPropertyName("promoIssued")]
    public string PromoIssued { get; set; } = "DESI20";
}

public class StoreSettings
{
    [JsonPropertyName("gstPercent")]
    public double GstPercent { get; set; } = 5;

    [JsonPropertyName("isGstEnabled")]
    public bool IsGstEnabled { get; set; } = true;

    [JsonPropertyName("taxName")]
    public string TaxName { get; set; } = "GST (CGST 2.5% + SGST 2.5%)";

    [JsonPropertyName("freeDeliveryThreshold")]
    public double FreeDeliveryThreshold { get; set; } = 499;

    [JsonPropertyName("standardDeliveryFee")]
    public double StandardDeliveryFee { get; set; } = 49;

    [JsonPropertyName("isFreeDeliveryEnabled")]
    public bool IsFreeDeliveryEnabled { get; set; } = true;

    [JsonPropertyName("restaurantGstin")]
    public string? RestaurantGstin { get; set; } = "07AABCF1234F1Z8";

    [JsonPropertyName("fssaiNumber")]
    public string? FssaiNumber { get; set; } = "10020011005829";
}

public class UserCart
{
    [JsonPropertyName("items")]
    public List<OrderItem> Items { get; set; } = new();

    [JsonPropertyName("subtotal")]
    public double Subtotal { get; set; }

    [JsonPropertyName("updatedAt")]
    public string UpdatedAt { get; set; } = DateTime.UtcNow.ToString("o");
}
