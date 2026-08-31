using FoodEat.Api.Data;
using FoodEat.Api.DTOs;
using FoodEat.Api.Models;

namespace FoodEat.Api.Services;

public interface IPromoService
{
    Task<List<PromoCode>> GetPromosAsync();
    Task<PromoCode?> GetFlashPromoAsync();
    Task<ValidatePromoResponse> ValidatePromoAsync(ValidatePromoRequest request);
    Task<PromoCode> CreatePromoAsync(PromoCode promo);
    Task<PromoCode?> UpdatePromoAsync(string code, PromoCode updates);
    Task<bool> DeletePromoAsync(string code);
}

public class PromoService : IPromoService
{
    private readonly JsonDataStore _store;

    public PromoService(JsonDataStore store)
    {
        _store = store;
    }

    public Task<List<PromoCode>> GetPromosAsync()
    {
        var promos = _store.Read(db => db.PromoCodes ?? new List<PromoCode>());
        return Task.FromResult(promos);
    }

    public Task<PromoCode?> GetFlashPromoAsync()
    {
        var promo = _store.Read(db =>
        {
            var active = (db.PromoCodes ?? new List<PromoCode>()).Where(p => p.IsActive).ToList();
            var flash = active.FirstOrDefault(p => p.IsFlashBanner == true);
            return flash ?? active.FirstOrDefault();
        });

        return Task.FromResult(promo);
    }

    public Task<ValidatePromoResponse> ValidatePromoAsync(ValidatePromoRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Code))
        {
            return Task.FromResult(new ValidatePromoResponse
            {
                Valid = false,
                Discount = 0,
                Message = "Promo code is required"
            });
        }

        var cleanCode = request.Code.Trim().ToUpperInvariant();
        var promo = _store.Read(db => (db.PromoCodes ?? new List<PromoCode>())
            .FirstOrDefault(p => p.Code.Equals(cleanCode, StringComparison.OrdinalIgnoreCase) && p.IsActive));

        if (promo == null)
        {
            return Task.FromResult(new ValidatePromoResponse
            {
                Valid = false,
                Discount = 0,
                Message = "Invalid or expired promo code."
            });
        }

        if (request.Subtotal < promo.MinSpend)
        {
            return Task.FromResult(new ValidatePromoResponse
            {
                Valid = false,
                Discount = 0,
                Message = $"Minimum order of ₹{promo.MinSpend} required for code {promo.Code}."
            });
        }

        double discount = 0;
        if (promo.DiscountPercent.HasValue && promo.DiscountPercent.Value > 0)
        {
            discount = (request.Subtotal * promo.DiscountPercent.Value) / 100.0;
        }
        else if (promo.FixedDiscount.HasValue && promo.FixedDiscount.Value > 0)
        {
            discount = Math.Min(promo.FixedDiscount.Value, request.Subtotal);
        }

        return Task.FromResult(new ValidatePromoResponse
        {
            Success = true,
            Valid = true,
            Discount = Math.Round(discount, 2),
            Message = !string.IsNullOrEmpty(promo.Description) ? promo.Description : $"{promo.Code} applied successfully!"
        });
    }

    public Task<PromoCode> CreatePromoAsync(PromoCode promo)
    {
        promo.Code = promo.Code.Trim().ToUpperInvariant();

        var created = _store.Update(db =>
        {
            if (db.PromoCodes == null) db.PromoCodes = new List<PromoCode>();

            if (promo.IsFlashBanner == true)
            {
                foreach (var p in db.PromoCodes) p.IsFlashBanner = false;
            }

            var existingIdx = db.PromoCodes.FindIndex(p => p.Code.Equals(promo.Code, StringComparison.OrdinalIgnoreCase));
            if (existingIdx >= 0)
            {
                db.PromoCodes[existingIdx] = promo;
            }
            else
            {
                db.PromoCodes.Insert(0, promo);
            }
            return promo;
        });

        return Task.FromResult(created);
    }

    public Task<PromoCode?> UpdatePromoAsync(string code, PromoCode updates)
    {
        var cleanCode = code.Trim().ToUpperInvariant();
        var updated = _store.Update(db =>
        {
            if (db.PromoCodes == null) return null;
            var idx = db.PromoCodes.FindIndex(p => p.Code.Equals(cleanCode, StringComparison.OrdinalIgnoreCase));
            if (idx == -1) return null;

            if (updates.IsFlashBanner == true)
            {
                foreach (var p in db.PromoCodes) p.IsFlashBanner = false;
            }

            updates.Code = cleanCode;
            db.PromoCodes[idx] = updates;
            return db.PromoCodes[idx];
        });

        return Task.FromResult(updated);
    }

    public Task<bool> DeletePromoAsync(string code)
    {
        var cleanCode = code.Trim().ToUpperInvariant();
        var deleted = _store.Update(db =>
        {
            if (db.PromoCodes == null) return false;
            var initLen = db.PromoCodes.Count;
            db.PromoCodes.RemoveAll(p => p.Code.Equals(cleanCode, StringComparison.OrdinalIgnoreCase));
            return db.PromoCodes.Count < initLen;
        });

        return Task.FromResult(deleted);
    }
}
