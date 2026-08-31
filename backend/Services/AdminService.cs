using FoodEat.Api.Data;
using FoodEat.Api.DTOs;
using FoodEat.Api.Models;

namespace FoodEat.Api.Services;

public interface IAdminService
{
    Task<AdminStatsResponse> GetAdminStatsAsync();
    Task<List<ContactInquiry>> GetInquiriesAsync();
    Task<ContactInquiry> CreateInquiryAsync(ContactInquiry inquiry);
    Task<bool> DeleteInquiryAsync(string id);
    Task<List<NewsletterSubscriber>> GetSubscribersAsync();
    Task<ApiResponse<string>> SubscribeNewsletterAsync(string email);
    Task<bool> DeleteSubscriberAsync(string email);
    Task<List<FeedbackReview>> GetReviewsAsync();
    Task<FeedbackReview> CreateReviewAsync(FeedbackReview review);
    Task<bool> DeleteReviewAsync(string id);
    Task<ChefSpecialConfig?> GetChefSpecialAsync();
    Task<ChefSpecialConfig> UpdateChefSpecialAsync(ChefSpecialConfig updates);
    Task<List<TrendingSpotlightItem>> GetTrendingSpotlightsAsync(bool adminOnly = false);
    Task<TrendingSpotlightItem> CreateTrendingSpotlightAsync(TrendingSpotlightItem item);
    Task<TrendingSpotlightItem?> UpdateTrendingSpotlightAsync(string id, TrendingSpotlightItem updates);
    Task<bool> DeleteTrendingSpotlightAsync(string id);
    Task<List<FeastBoxTier>> GetFeastBoxTiersAsync(bool adminOnly = false);
    Task<FeastBoxTier> CreateFeastBoxTierAsync(FeastBoxTier tier);
    Task<FeastBoxTier?> UpdateFeastBoxTierAsync(string id, FeastBoxTier updates);
    Task<bool> DeleteFeastBoxTierAsync(string id);
    Task<StoreSettings> GetStoreSettingsAsync();
    Task<StoreSettings> UpdateStoreSettingsAsync(StoreSettings settings);
    Task<UserCart> GetCartAsync(string userId);
    Task<UserCart> SyncCartAsync(string userId, List<OrderItem> items);
    Task<bool> ClearCartAsync(string userId);
}

public class AdminService : IAdminService
{
    private readonly JsonDataStore _store;

    public AdminService(JsonDataStore store)
    {
        _store = store;
    }

    public Task<AdminStatsResponse> GetAdminStatsAsync()
    {
        var response = _store.Read(db =>
        {
            var orders = db.Orders ?? new List<Order>();
            var reviews = db.Reviews ?? new List<FeedbackReview>();
            var inquiries = db.ContactInquiries ?? new List<ContactInquiry>();
            var subscribers = db.Subscribers ?? new List<NewsletterSubscriber>();
            var promos = db.PromoCodes ?? new List<PromoCode>();

            var totalRevenue = orders.Sum(o => o.Total);
            var activeOrders = orders.Count(o => !o.Status.Equals("DELIVERED", StringComparison.OrdinalIgnoreCase));
            var completedOrders = orders.Count(o => o.Status.Equals("DELIVERED", StringComparison.OrdinalIgnoreCase));
            var aov = orders.Count > 0 ? totalRevenue / orders.Count : 0;
            var avgRating = reviews.Count > 0 ? reviews.Average(r => r.Rating) : 4.9;

            return new AdminStatsResponse
            {
                Success = true,
                Stats = new AdminOverviewStats
                {
                    TotalOrders = orders.Count,
                    ActiveOrders = activeOrders,
                    CompletedOrders = completedOrders,
                    TotalRevenue = Math.Round(totalRevenue, 2),
                    AverageOrderValue = Math.Round(aov, 2),
                    TotalSubscribers = subscribers.Count,
                    TotalInquiries = inquiries.Count,
                    TotalPromos = promos.Count,
                    TotalReviews = reviews.Count,
                    AverageRating = Math.Round(avgRating, 1)
                },
                Orders = orders,
                Inquiries = inquiries,
                Subscribers = subscribers,
                Promos = promos,
                Reviews = reviews
            };
        });

        return Task.FromResult(response);
    }

    // ==================== INQUIRIES ====================
    public Task<List<ContactInquiry>> GetInquiriesAsync()
    {
        var inquiries = _store.Read(db => db.ContactInquiries ?? new List<ContactInquiry>());
        return Task.FromResult(inquiries);
    }

    public Task<ContactInquiry> CreateInquiryAsync(ContactInquiry inquiry)
    {
        inquiry.Id = $"INQ-{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds().ToString().Substring(Math.Max(0, DateTimeOffset.UtcNow.ToUnixTimeMilliseconds().ToString().Length - 6))}";
        inquiry.CreatedAt = DateTime.UtcNow.ToString("o");

        var created = _store.Update(db =>
        {
            if (db.ContactInquiries == null) db.ContactInquiries = new List<ContactInquiry>();
            db.ContactInquiries.Insert(0, inquiry);
            return inquiry;
        });

        return Task.FromResult(created);
    }

    public Task<bool> DeleteInquiryAsync(string id)
    {
        var deleted = _store.Update(db =>
        {
            if (db.ContactInquiries == null) return false;
            var initLen = db.ContactInquiries.Count;
            db.ContactInquiries.RemoveAll(i => i.Id.Equals(id, StringComparison.OrdinalIgnoreCase));
            return db.ContactInquiries.Count < initLen;
        });

        return Task.FromResult(deleted);
    }

    // ==================== SUBSCRIBERS ====================
    public Task<List<NewsletterSubscriber>> GetSubscribersAsync()
    {
        var subs = _store.Read(db => db.Subscribers ?? new List<NewsletterSubscriber>());
        return Task.FromResult(subs);
    }

    public Task<ApiResponse<string>> SubscribeNewsletterAsync(string email)
    {
        if (string.IsNullOrWhiteSpace(email))
        {
            return Task.FromResult(new ApiResponse<string> { Success = false, Message = "Email is required." });
        }

        var cleanEmail = email.Trim().ToLowerInvariant();
        var result = _store.Update(db =>
        {
            if (db.Subscribers == null) db.Subscribers = new List<NewsletterSubscriber>();
            var existing = db.Subscribers.FirstOrDefault(s => s.Email.Equals(cleanEmail, StringComparison.OrdinalIgnoreCase));

            var activePromo = (db.PromoCodes ?? new List<PromoCode>()).FirstOrDefault(p => p.IsActive);
            var promoCode = activePromo != null ? activePromo.Code : "VIPFEAST";

            if (existing != null)
            {
                return new ApiResponse<string>
                {
                    Success = true,
                    Message = $"You're already subscribed! Use code {existing.PromoIssued} for your VIP feast.",
                    Data = existing.PromoIssued
                };
            }

            db.Subscribers.Insert(0, new NewsletterSubscriber
            {
                Email = cleanEmail,
                SubscribedAt = DateTime.UtcNow.ToString("o"),
                PromoIssued = promoCode
            });

            return new ApiResponse<string>
            {
                Success = true,
                Message = $"Welcome to FoodEat VIP Club! Use code {promoCode} for your royal discount.",
                Data = promoCode
            };
        });

        return Task.FromResult(result);
    }

    public Task<bool> DeleteSubscriberAsync(string email)
    {
        var cleanEmail = email.Trim().ToLowerInvariant();
        var deleted = _store.Update(db =>
        {
            if (db.Subscribers == null) return false;
            var initLen = db.Subscribers.Count;
            db.Subscribers.RemoveAll(s => s.Email.Equals(cleanEmail, StringComparison.OrdinalIgnoreCase));
            return db.Subscribers.Count < initLen;
        });

        return Task.FromResult(deleted);
    }

    // ==================== REVIEWS ====================
    public Task<List<FeedbackReview>> GetReviewsAsync()
    {
        var reviews = _store.Read(db => (db.Reviews ?? new List<FeedbackReview>())
            .OrderByDescending(r => DateTime.TryParse(r.CreatedAt, out var dt) ? dt : DateTime.MinValue)
            .ToList());
        return Task.FromResult(reviews);
    }

    public Task<FeedbackReview> CreateReviewAsync(FeedbackReview review)
    {
        review.Id = $"REV-{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds().ToString().Substring(Math.Max(0, DateTimeOffset.UtcNow.ToUnixTimeMilliseconds().ToString().Length - 6))}";
        review.CreatedAt = DateTime.UtcNow.ToString("o");
        review.Verified = true;

        var created = _store.Update(db =>
        {
            if (db.Reviews == null) db.Reviews = new List<FeedbackReview>();
            db.Reviews.Insert(0, review);

            if (!string.IsNullOrWhiteSpace(review.OrderId) && db.Orders != null)
            {
                var ord = db.Orders.FirstOrDefault(o => o.Id.Equals(review.OrderId, StringComparison.OrdinalIgnoreCase));
                if (ord != null) ord.FeedbackSubmitted = true;
            }

            return review;
        });

        return Task.FromResult(created);
    }

    public Task<bool> DeleteReviewAsync(string id)
    {
        var deleted = _store.Update(db =>
        {
            if (db.Reviews == null) return false;
            var initLen = db.Reviews.Count;
            db.Reviews.RemoveAll(r => r.Id.Equals(id, StringComparison.OrdinalIgnoreCase));
            return db.Reviews.Count < initLen;
        });

        return Task.FromResult(deleted);
    }

    // ==================== CHEF SPECIAL ====================
    public Task<ChefSpecialConfig?> GetChefSpecialAsync()
    {
        var config = _store.Read(db =>
        {
            var special = db.ChefSpecial ?? new ChefSpecialConfig();
            var allProds = db.CustomProducts ?? new List<Product>();
            special.Product = allProds.FirstOrDefault(p => p.Id.Equals(special.ProductId, StringComparison.OrdinalIgnoreCase)) ?? allProds.FirstOrDefault();
            return special;
        });

        return Task.FromResult<ChefSpecialConfig?>(config);
    }

    public Task<ChefSpecialConfig> UpdateChefSpecialAsync(ChefSpecialConfig updates)
    {
        var updated = _store.Update(db =>
        {
            db.ChefSpecial = updates;
            var allProds = db.CustomProducts ?? new List<Product>();
            updates.Product = allProds.FirstOrDefault(p => p.Id.Equals(updates.ProductId, StringComparison.OrdinalIgnoreCase)) ?? allProds.FirstOrDefault();
            return db.ChefSpecial;
        });

        return Task.FromResult(updated);
    }

    // ==================== TRENDING SPOTLIGHTS ====================
    public Task<List<TrendingSpotlightItem>> GetTrendingSpotlightsAsync(bool adminOnly = false)
    {
        var list = _store.Read(db =>
        {
            var spotlights = db.TrendingSpotlights ?? new List<TrendingSpotlightItem>();
            var allProds = db.CustomProducts ?? new List<Product>();

            if (!adminOnly)
            {
                spotlights = spotlights.Where(s => s.IsActive).ToList();
            }

            foreach (var s in spotlights)
            {
                s.Product = allProds.FirstOrDefault(p => p.Id.Equals(s.ProductId, StringComparison.OrdinalIgnoreCase));
            }

            return spotlights.OrderBy(s => s.Priority).ToList();
        });

        return Task.FromResult(list);
    }

    public Task<TrendingSpotlightItem> CreateTrendingSpotlightAsync(TrendingSpotlightItem item)
    {
        item.Id = $"trend-{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}";
        item.CreatedAt = DateTime.UtcNow.ToString("o");

        var created = _store.Update(db =>
        {
            if (db.TrendingSpotlights == null) db.TrendingSpotlights = new List<TrendingSpotlightItem>();
            db.TrendingSpotlights.Insert(0, item);
            return item;
        });

        return Task.FromResult(created);
    }

    public Task<TrendingSpotlightItem?> UpdateTrendingSpotlightAsync(string id, TrendingSpotlightItem updates)
    {
        var updated = _store.Update(db =>
        {
            if (db.TrendingSpotlights == null) return null;
            var idx = db.TrendingSpotlights.FindIndex(t => t.Id.Equals(id, StringComparison.OrdinalIgnoreCase));
            if (idx == -1) return null;

            updates.Id = db.TrendingSpotlights[idx].Id;
            db.TrendingSpotlights[idx] = updates;
            return db.TrendingSpotlights[idx];
        });

        return Task.FromResult(updated);
    }

    public Task<bool> DeleteTrendingSpotlightAsync(string id)
    {
        var deleted = _store.Update(db =>
        {
            if (db.TrendingSpotlights == null) return false;
            var initLen = db.TrendingSpotlights.Count;
            db.TrendingSpotlights.RemoveAll(t => t.Id.Equals(id, StringComparison.OrdinalIgnoreCase));
            return db.TrendingSpotlights.Count < initLen;
        });

        return Task.FromResult(deleted);
    }

    // ==================== FEAST BOX TIERS ====================
    public Task<List<FeastBoxTier>> GetFeastBoxTiersAsync(bool adminOnly = false)
    {
        var tiers = _store.Read(db =>
        {
            var list = db.FeastBoxTiers ?? new List<FeastBoxTier>();
            if (!adminOnly) list = list.Where(t => t.IsActive).ToList();
            return list.OrderBy(t => t.Count).ToList();
        });

        return Task.FromResult(tiers);
    }

    public Task<FeastBoxTier> CreateFeastBoxTierAsync(FeastBoxTier tier)
    {
        tier.Id = $"tier-{tier.Count}-{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds().ToString().Substring(Math.Max(0, DateTimeOffset.UtcNow.ToUnixTimeMilliseconds().ToString().Length - 4))}";

        var created = _store.Update(db =>
        {
            if (db.FeastBoxTiers == null) db.FeastBoxTiers = new List<FeastBoxTier>();
            db.FeastBoxTiers.Add(tier);
            return tier;
        });

        return Task.FromResult(created);
    }

    public Task<FeastBoxTier?> UpdateFeastBoxTierAsync(string id, FeastBoxTier updates)
    {
        var updated = _store.Update(db =>
        {
            if (db.FeastBoxTiers == null) return null;
            var idx = db.FeastBoxTiers.FindIndex(t => t.Id.Equals(id, StringComparison.OrdinalIgnoreCase));
            if (idx == -1) return null;

            updates.Id = db.FeastBoxTiers[idx].Id;
            db.FeastBoxTiers[idx] = updates;
            return db.FeastBoxTiers[idx];
        });

        return Task.FromResult(updated);
    }

    public Task<bool> DeleteFeastBoxTierAsync(string id)
    {
        var deleted = _store.Update(db =>
        {
            if (db.FeastBoxTiers == null) return false;
            var initLen = db.FeastBoxTiers.Count;
            db.FeastBoxTiers.RemoveAll(t => t.Id.Equals(id, StringComparison.OrdinalIgnoreCase));
            return db.FeastBoxTiers.Count < initLen;
        });

        return Task.FromResult(deleted);
    }

    // ==================== STORE SETTINGS ====================
    public Task<StoreSettings> GetStoreSettingsAsync()
    {
        var settings = _store.Read(db => db.Settings ?? new StoreSettings());
        return Task.FromResult(settings);
    }

    public Task<StoreSettings> UpdateStoreSettingsAsync(StoreSettings settings)
    {
        var updated = _store.Update(db =>
        {
            db.Settings = settings;
            return db.Settings;
        });

        return Task.FromResult(updated);
    }

    // ==================== CART ====================
    public Task<UserCart> GetCartAsync(string userId)
    {
        var userKey = string.IsNullOrWhiteSpace(userId) ? "guest" : userId;
        var cart = _store.Read(db =>
        {
            if (db.Carts != null && db.Carts.TryGetValue(userKey, out var userCart))
            {
                return userCart;
            }
            return new UserCart();
        });

        return Task.FromResult(cart);
    }

    public Task<UserCart> SyncCartAsync(string userId, List<OrderItem> items)
    {
        var userKey = string.IsNullOrWhiteSpace(userId) ? "guest" : userId;
        var subtotal = items?.Sum(i => i.Price * i.Quantity) ?? 0;

        var cart = new UserCart
        {
            Items = items ?? new List<OrderItem>(),
            Subtotal = subtotal,
            UpdatedAt = DateTime.UtcNow.ToString("o")
        };

        _store.Update(db =>
        {
            if (db.Carts == null) db.Carts = new Dictionary<string, UserCart>();
            db.Carts[userKey] = cart;
        });

        return Task.FromResult(cart);
    }

    public Task<bool> ClearCartAsync(string userId)
    {
        var userKey = string.IsNullOrWhiteSpace(userId) ? "guest" : userId;
        var cleared = _store.Update(db =>
        {
            if (db.Carts != null && db.Carts.ContainsKey(userKey))
            {
                db.Carts.Remove(userKey);
                return true;
            }
            return false;
        });

        return Task.FromResult(cleared);
    }
}
