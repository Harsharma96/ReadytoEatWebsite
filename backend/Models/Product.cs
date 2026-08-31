using System.Text.Json.Serialization;

namespace FoodEat.Api.Models;

public class NutritionInfo
{
    [JsonPropertyName("calories")]
    public int Calories { get; set; } = 480;

    [JsonPropertyName("protein")]
    public string Protein { get; set; } = "24g";

    [JsonPropertyName("carbs")]
    public string Carbs { get; set; } = "36g";

    [JsonPropertyName("fat")]
    public string Fat { get; set; } = "18g";

    [JsonPropertyName("fiber")]
    public string? Fiber { get; set; } = "6g";
}

public class CustomizationOption
{
    [JsonPropertyName("id")]
    public string Id { get; set; } = string.Empty;

    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("price")]
    public double Price { get; set; }
}

public class CustomizationGroup
{
    [JsonPropertyName("id")]
    public string Id { get; set; } = string.Empty;

    [JsonPropertyName("title")]
    public string Title { get; set; } = string.Empty;

    [JsonPropertyName("type")]
    public string Type { get; set; } = "single"; // single, multi

    [JsonPropertyName("required")]
    public bool Required { get; set; } = false;

    [JsonPropertyName("options")]
    public List<CustomizationOption> Options { get; set; } = new();
}

public class Product
{
    [JsonPropertyName("id")]
    public string Id { get; set; } = string.Empty;

    [JsonPropertyName("slug")]
    public string? Slug { get; set; }

    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("category")]
    public string Category { get; set; } = "Burgers & Wraps";

    [JsonPropertyName("accentColor")]
    public string? AccentColor { get; set; } = "#FF6B35";

    [JsonPropertyName("gradientBg")]
    public string? GradientBg { get; set; } = "from-[#FFF0E5] to-[#FFE4D6]";

    [JsonPropertyName("badge")]
    public string? Badge { get; set; } = "Chef Special";

    [JsonPropertyName("tagline")]
    public string? Tagline { get; set; } = "Handcrafted Luxury";

    [JsonPropertyName("shortDescription")]
    public string ShortDescription { get; set; } = "Master chef handcrafted culinary dish.";

    [JsonPropertyName("fullDescription")]
    public string? FullDescription { get; set; } = "Handcrafted with pure avocado oil, farm-fresh regenerative harvests, and zero seed oils.";

    [JsonPropertyName("price")]
    public double Price { get; set; }

    [JsonPropertyName("originalPrice")]
    public double? OriginalPrice { get; set; }

    [JsonPropertyName("currency")]
    public string Currency { get; set; } = "INR";

    [JsonPropertyName("rating")]
    public double Rating { get; set; } = 4.9;

    [JsonPropertyName("reviewCount")]
    public int ReviewCount { get; set; } = 12;

    [JsonPropertyName("prepTime")]
    public string? PrepTime { get; set; } = "20-25 mins";

    [JsonPropertyName("calories")]
    public int Calories { get; set; } = 480;

    [JsonPropertyName("images")]
    public List<string> Images { get; set; } = new();

    [JsonPropertyName("tags")]
    public List<string> Tags { get; set; } = new();

    [JsonPropertyName("dietary")]
    public List<string> Dietary { get; set; } = new();

    [JsonPropertyName("nutrition")]
    public NutritionInfo? Nutrition { get; set; }

    [JsonPropertyName("ingredients")]
    public List<string>? Ingredients { get; set; }

    [JsonPropertyName("customizations")]
    public List<CustomizationGroup>? Customizations { get; set; }

    [JsonPropertyName("isNew")]
    public bool IsNew { get; set; } = false;

    [JsonPropertyName("featured")]
    public bool Featured { get; set; } = true;

    [JsonPropertyName("inStock")]
    public bool InStock { get; set; } = true;

    [JsonPropertyName("netWeight")]
    public string? NetWeight { get; set; } = "420g";

    [JsonPropertyName("createdAt")]
    public string CreatedAt { get; set; } = DateTime.UtcNow.ToString("o");
}

public class Category
{
    [JsonPropertyName("id")]
    public string Id { get; set; } = string.Empty;

    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("emoji")]
    public string Emoji { get; set; } = "🍽️";

    [JsonPropertyName("subtitle")]
    public string Subtitle { get; set; } = "Chef Specialty";

    [JsonPropertyName("bgGradient")]
    public string? BgGradient { get; set; } = "from-[#FFF0E5] to-[#FFE4D6]";

    [JsonPropertyName("borderColor")]
    public string? BorderColor { get; set; } = "border-[#FF6B35]/40";

    [JsonPropertyName("accent")]
    public string? Accent { get; set; } = "#FF6B35";

    [JsonPropertyName("priority")]
    public int Priority { get; set; } = 1;

    [JsonPropertyName("isActive")]
    public bool IsActive { get; set; } = true;

    [JsonPropertyName("createdAt")]
    public string? CreatedAt { get; set; } = DateTime.UtcNow.ToString("o");
}
