using System.Text.Json;
using System.Text.Json.Serialization;
using FoodEat.Api.Models;

namespace FoodEat.Api.Data;

public class DatabaseSchema
{
    [JsonPropertyName("users")]
    public List<User> Users { get; set; } = new();

    [JsonPropertyName("orders")]
    public List<Order> Orders { get; set; } = new();

    [JsonPropertyName("receiptArchive")]
    public List<PaymentTransaction> ReceiptArchive { get; set; } = new();

    [JsonPropertyName("customProducts")]
    public List<Product> CustomProducts { get; set; } = new();

    [JsonPropertyName("deletedCatalogProductIds")]
    public List<string> DeletedCatalogProductIds { get; set; } = new();

    [JsonPropertyName("promoCodes")]
    public List<PromoCode> PromoCodes { get; set; } = new();

    [JsonPropertyName("contactInquiries")]
    public List<ContactInquiry> ContactInquiries { get; set; } = new();

    [JsonPropertyName("subscribers")]
    public List<NewsletterSubscriber> Subscribers { get; set; } = new();

    [JsonPropertyName("reviews")]
    public List<FeedbackReview> Reviews { get; set; } = new();

    [JsonPropertyName("feastBoxTiers")]
    public List<FeastBoxTier> FeastBoxTiers { get; set; } = new();

    [JsonPropertyName("settings")]
    public StoreSettings Settings { get; set; } = new();

    [JsonPropertyName("paymentGatewaySettings")]
    public PaymentGatewaySettings PaymentGatewaySettings { get; set; } = new();

    [JsonPropertyName("trendingSpotlights")]
    public List<TrendingSpotlightItem> TrendingSpotlights { get; set; } = new();

    [JsonPropertyName("categories")]
    public List<Category> Categories { get; set; } = new();

    [JsonPropertyName("chefSpecial")]
    public ChefSpecialConfig? ChefSpecial { get; set; }

    [JsonPropertyName("passwordResets")]
    public List<PasswordResetRecord> PasswordResets { get; set; } = new();

    [JsonPropertyName("carts")]
    public Dictionary<string, UserCart> Carts { get; set; } = new();
}

public class JsonDataStore
{
    private readonly string _dbFilePath;
    private readonly ReaderWriterLockSlim _lock = new();
    private readonly JsonSerializerOptions _jsonOptions = new()
    {
        WriteIndented = true,
        PropertyNameCaseInsensitive = true,
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
    };

    private DatabaseSchema _memoryCache = new();

    public JsonDataStore(IConfiguration configuration, IWebHostEnvironment env)
    {
        var configuredPath = configuration["Data:DbFilePath"] ?? "data/db.json";
        _dbFilePath = Path.IsPathRooted(configuredPath)
            ? configuredPath
            : Path.Combine(env.ContentRootPath, configuredPath);

        InitializeDatabase();
    }

    private void InitializeDatabase()
    {
        var directory = Path.GetDirectoryName(_dbFilePath);
        if (!string.IsNullOrEmpty(directory) && !Directory.Exists(directory))
        {
            Directory.CreateDirectory(directory);
        }

        if (!File.Exists(_dbFilePath))
        {
            _memoryCache = CreateInitialSchema();
            SaveDataInternal(_memoryCache);
        }
        else
        {
            // Verify file can be read and seeded if needed
            _memoryCache = GetDataInternal();
            bool modified = false;

            if (_memoryCache.Users == null || _memoryCache.Users.Count == 0)
            {
                _memoryCache.Users = CreateInitialUsers();
                modified = true;
            }
            else
            {
                var adminGmail = _memoryCache.Users.FirstOrDefault(u => u.Email.Equals("Admin@gmail.com", StringComparison.OrdinalIgnoreCase));
                if (adminGmail == null)
                {
                    _memoryCache.Users.Add(new User
                    {
                        Id = "ADM-002",
                        Name = "FoodEat Admin",
                        Email = "Admin@gmail.com",
                        Password = BCrypt.Net.BCrypt.HashPassword("Harsh@9675", 12),
                        Phone = "+91-9999999999",
                        Role = "admin",
                        Avatar = "https://ui-avatars.com/api/?name=Admin&background=FF6B35&color=fff&bold=true&size=128",
                        LoyaltyPoints = 500,
                        CreatedAt = DateTime.UtcNow.ToString("o")
                    });
                    modified = true;
                }
                else
                {
                    bool matches = false;
                    try { matches = BCrypt.Net.BCrypt.Verify("Harsh@9675", adminGmail.Password); } catch {}
                    if (!matches)
                    {
                        adminGmail.Password = BCrypt.Net.BCrypt.HashPassword("Harsh@9675", 12);
                        modified = true;
                    }
                }
            }

            if (_memoryCache.Categories == null || _memoryCache.Categories.Count == 0)
            {
                _memoryCache.Categories = CreateInitialCategories();
                modified = true;
            }

            if (_memoryCache.PromoCodes == null || _memoryCache.PromoCodes.Count == 0)
            {
                _memoryCache.PromoCodes = CreateInitialPromos();
                modified = true;
            }

            if (_memoryCache.FeastBoxTiers == null || _memoryCache.FeastBoxTiers.Count == 0)
            {
                _memoryCache.FeastBoxTiers = CreateInitialFeastBoxTiers();
                modified = true;
            }

            if (_memoryCache.TrendingSpotlights == null || _memoryCache.TrendingSpotlights.Count == 0)
            {
                _memoryCache.TrendingSpotlights = CreateInitialTrending();
                modified = true;
            }

            if (_memoryCache.ChefSpecial == null)
            {
                _memoryCache.ChefSpecial = new ChefSpecialConfig();
                modified = true;
            }

            if (_memoryCache.Settings == null)
            {
                _memoryCache.Settings = new StoreSettings();
                modified = true;
            }

            if (_memoryCache.PaymentGatewaySettings == null)
            {
                _memoryCache.PaymentGatewaySettings = new PaymentGatewaySettings();
                modified = true;
            }

            if (modified)
            {
                SaveDataInternal(_memoryCache);
            }
        }
    }

    public T Read<T>(Func<DatabaseSchema, T> query)
    {
        _lock.EnterReadLock();
        try
        {
            return query(_memoryCache);
        }
        finally
        {
            _lock.ExitReadLock();
        }
    }

    public void Update(Action<DatabaseSchema> updateAction)
    {
        _lock.EnterWriteLock();
        try
        {
            updateAction(_memoryCache);
            SaveDataInternal(_memoryCache);
        }
        finally
        {
            _lock.ExitWriteLock();
        }
    }

    public T Update<T>(Func<DatabaseSchema, T> updateFunc)
    {
        _lock.EnterWriteLock();
        try
        {
            var result = updateFunc(_memoryCache);
            SaveDataInternal(_memoryCache);
            return result;
        }
        finally
        {
            _lock.ExitWriteLock();
        }
    }

    private DatabaseSchema GetDataInternal()
    {
        try
        {
            if (!File.Exists(_dbFilePath)) return CreateInitialSchema();
            var json = File.ReadAllText(_dbFilePath);
            var parsed = JsonSerializer.Deserialize<DatabaseSchema>(json, _jsonOptions);
            return parsed ?? CreateInitialSchema();
        }
        catch (Exception)
        {
            return CreateInitialSchema();
        }
    }

    private void SaveDataInternal(DatabaseSchema data)
    {
        try
        {
            var json = JsonSerializer.Serialize(data, _jsonOptions);
            var tempPath = _dbFilePath + ".tmp";
            File.WriteAllText(tempPath, json);
            File.Move(tempPath, _dbFilePath, true);
        }
        catch
        {
            try
            {
                var json = JsonSerializer.Serialize(data, _jsonOptions);
                File.WriteAllText(_dbFilePath, json);
            }
            catch
            {
                // Logging can be added here
            }
        }
    }

    private DatabaseSchema CreateInitialSchema()
    {
        return new DatabaseSchema
        {
            Users = CreateInitialUsers(),
            Orders = new List<Order>(),
            ReceiptArchive = new List<PaymentTransaction>(),
            CustomProducts = new List<Product>(),
            DeletedCatalogProductIds = new List<string>(),
            PromoCodes = CreateInitialPromos(),
            ContactInquiries = new List<ContactInquiry>(),
            Subscribers = new List<NewsletterSubscriber>(),
            Reviews = CreateInitialReviews(),
            FeastBoxTiers = CreateInitialFeastBoxTiers(),
            Settings = new StoreSettings(),
            PaymentGatewaySettings = new PaymentGatewaySettings(),
            TrendingSpotlights = CreateInitialTrending(),
            Categories = CreateInitialCategories(),
            ChefSpecial = new ChefSpecialConfig(),
            PasswordResets = new List<PasswordResetRecord>(),
            Carts = new Dictionary<string, UserCart>()
        };
    }

    private List<User> CreateInitialUsers()
    {
        return new List<User>
        {
            new User
            {
                Id = "ADM-001",
                Name = "FoodEat Admin",
                Email = "admin@foodeat.in",
                Password = BCrypt.Net.BCrypt.HashPassword("Harsh@9675", 12),
                Phone = "+91-9999999999",
                Role = "admin",
                Avatar = "https://ui-avatars.com/api/?name=Admin&background=FF6B35&color=fff&bold=true&size=128",
                LoyaltyPoints = 500,
                CreatedAt = DateTime.UtcNow.ToString("o")
            },
            new User
            {
                Id = "ADM-002",
                Name = "FoodEat Admin",
                Email = "Admin@gmail.com",
                Password = BCrypt.Net.BCrypt.HashPassword("Harsh@9675", 12),
                Phone = "+91-9999999999",
                Role = "admin",
                Avatar = "https://ui-avatars.com/api/?name=Admin&background=FF6B35&color=fff&bold=true&size=128",
                LoyaltyPoints = 500,
                CreatedAt = DateTime.UtcNow.ToString("o")
            }
        };
    }

    private List<Category> CreateInitialCategories()
    {
        return new List<Category>
        {
            new Category { Id = "cat-burgers", Name = "Burgers & Wraps", Emoji = "🍔", Subtitle = "Smash & Crispy", BgGradient = "from-[#FFF0E5] to-[#FFE4D6]", BorderColor = "border-[#FF6B35]/40", Accent = "#FF6B35", Priority = 1, IsActive = true },
            new Category { Id = "cat-pizzas", Name = "Pizzas & Garlic Breads", Emoji = "🍕", Subtitle = "Cheese Burst", BgGradient = "from-[#FFE8EC] to-[#FFD5DC]", BorderColor = "border-[#FF4D6D]/40", Accent = "#FF4D6D", Priority = 2, IsActive = true },
            new Category { Id = "cat-snacks", Name = "Snacks & Chaat", Emoji = "🍟", Subtitle = "Peri Fries & Chaat", BgGradient = "from-[#FFF4E5] to-[#FFE6CC]", BorderColor = "border-[#FF8A00]/40", Accent = "#FF8A00", Priority = 3, IsActive = true },
            new Category { Id = "cat-chinese", Name = "Chinese & Momos", Emoji = "🥢", Subtitle = "Noodles & Dim Sum", BgGradient = "from-[#FFF2EB] to-[#FCD1B8]", BorderColor = "border-[#E85620]/40", Accent = "#E85620", Priority = 4, IsActive = true },
            new Category { Id = "cat-biryani", Name = "Biryani & North Indian", Emoji = "🍚", Subtitle = "Dum & Butter Curry", BgGradient = "from-[#FFFBF5] to-[#EFE1CE]", BorderColor = "border-[#D4A373]/40", Accent = "#D4A373", Priority = 5, IsActive = true },
            new Category { Id = "cat-gujarati", Name = "Gujarati & Thalis", Emoji = "🟡", Subtitle = "Undhiyu & Dhokla", BgGradient = "from-[#FFF9E6] to-[#FFEAB3]", BorderColor = "border-[#FFC94A]/50", Accent = "#FFC94A", Priority = 6, IsActive = true },
            new Category { Id = "cat-south-indian", Name = "South Indian", Emoji = "🥥", Subtitle = "Ghee Dosa & Idli", BgGradient = "from-[#EAF9EF] to-[#D5F5E0]", BorderColor = "border-[#3ECF6E]/40", Accent = "#3ECF6E", Priority = 7, IsActive = true },
            new Category { Id = "cat-chai", Name = "Chai, Coffee & Juices", Emoji = "☕", Subtitle = "Kulhad & Shakes", BgGradient = "from-[#F0FDF4] to-[#DCFCE7]", BorderColor = "border-[#22C55E]/40", Accent = "#22C55E", Priority = 8, IsActive = true },
            new Category { Id = "cat-desserts", Name = "Desserts & Shakes", Emoji = "🍰", Subtitle = "Choco Lava & Mithai", BgGradient = "from-[#FFF8F2] to-[#F5D8BF]", BorderColor = "border-[#E0A96D]/40", Accent = "#E0A96D", Priority = 9, IsActive = true }
        };
    }

    private List<PromoCode> CreateInitialPromos()
    {
        return new List<PromoCode>
        {
            new PromoCode { Code = "DESI20", DiscountPercent = 20, MinSpend = 499, Description = "20% OFF on Shahi Royal Feast orders", Title = "Unlock 20% Off on Royal Feast", BadgeText = "👑 LIMITED SHAHI RASOI OFFER", FreeItem = "2 Free 24K Gold Gulab Jamuns", IsActive = true, IsFlashBanner = true },
            new PromoCode { Code = "TAJ100", FixedDiscount = 100, MinSpend = 599, Description = "₹100 Flat OFF for Royal Food Lovers", Title = "Flat ₹100 Off on Grand Order", BadgeText = "⚡ CHEF SPECIAL", IsActive = true },
            new PromoCode { Code = "MAHARAJA25", DiscountPercent = 25, MinSpend = 999, Description = "25% OFF on Grand Dawat Box bundles", Title = "25% Off on Grand Dawat", BadgeText = "🔥 BIG SAVING", IsActive = true }
        };
    }

    private List<FeedbackReview> CreateInitialReviews()
    {
        return new List<FeedbackReview>
        {
            new FeedbackReview
            {
                Id = "REV-101",
                OrderId = "FE-82910",
                CustomerName = "Raja Vikramaditya Singhania",
                Rating = 5,
                MoodEmoji = "👑",
                DeliveryRating = 5,
                TasteRating = 5,
                FavoriteDish = "Shahi Awadhi Dum Gosht Biryani",
                Tags = new List<string> { "Mind Blowing Saffron", "Tender Lamb", "25-Min Thermal Delivery" },
                Comment = "The Awadhi Dum Biryani arrived steaming hot in a sealed clay handi! The aroma of Kashmiri saffron filled the room. Truly a royal 5-star experience.",
                CreatedAt = DateTime.UtcNow.AddHours(-2).ToString("o"),
                Verified = true
            },
            new FeedbackReview
            {
                Id = "REV-102",
                OrderId = "FE-73819",
                CustomerName = "Ananya Deshmukh",
                Rating = 5,
                MoodEmoji = "😋",
                DeliveryRating = 5,
                TasteRating = 5,
                FavoriteDish = "Double Melt Gourmet Smash Cheese Burger",
                Tags = new List<string> { "Super Juicy", "Molten Cheddar", "Ultra Crispy Fries" },
                Comment = "Best smash burger in town! The brioche was perfectly toasted, and the melted cheddar pull was insane. Peri-peri fries were still hot and crunchy!",
                CreatedAt = DateTime.UtcNow.AddHours(-5).ToString("o"),
                Verified = true
            }
        };
    }

    private List<FeastBoxTier> CreateInitialFeastBoxTiers()
    {
        return new List<FeastBoxTier>
        {
            new FeastBoxTier { Id = "tier-4", Count = 4, Title = "Shahi Mini Feast (4 Dishes)", DiscountPercent = 15, Badge = "15% OFF", Gift = "Complimentary Kesar Matka Lassi", FreeGifts = new List<string> { "15% Instant Dawat Discount", "Complimentary Kesar Matka Lassi", "Free Thermal Pod Delivery" }, IsActive = true },
            new FeastBoxTier { Id = "tier-6", Count = 6, Title = "Maharaja Royal Box (6 Dishes)", DiscountPercent = 20, Badge = "MOST POPULAR • 20% OFF", Gift = "Free 24K Gold Gulab Jamun Set", FreeGifts = new List<string> { "20% Instant Dawat Discount", "Free 24K Gold Gulab Jamun Set", "Priority 25-Min Thermal Transit" }, IsActive = true },
            new FeastBoxTier { Id = "tier-8", Count = 8, Title = "Nawabi Grand Dawat (8 Dishes)", DiscountPercent = 25, Badge = "BEST VALUE • 25% OFF", Gift = "Free Garlic Naan Basket + Saffron Rabdi", FreeGifts = new List<string> { "25% Maximum Royal Discount", "Free Garlic Naan Basket + Saffron Rabdi", "VIP Master Chef Concierge" }, IsActive = true }
        };
    }

    private List<TrendingSpotlightItem> CreateInitialTrending()
    {
        return new List<TrendingSpotlightItem>
        {
            new TrendingSpotlightItem { Id = "trend-1", ProductId = "desi-1018", CustomOfferTag = "🔥 TODAY'S SPECIAL: FLAT 20% OFF", OfferBadge = "CHEF TOP PICK", Priority = 1, IsActive = true, CreatedAt = DateTime.UtcNow.ToString("o") },
            new TrendingSpotlightItem { Id = "trend-2", ProductId = "double-smash-cheese-burger", CustomOfferTag = "👑 FREE GULAB JAMUN WITH THIS ORDER", OfferBadge = "ROYAL DEAL", Priority = 2, IsActive = true, CreatedAt = DateTime.UtcNow.ToString("o") }
        };
    }
}
