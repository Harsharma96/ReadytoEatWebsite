using FoodEat.Api.Data;
using FoodEat.Api.Models;

namespace FoodEat.Api.Services;

public interface IProductService
{
    Task<List<Product>> GetProductsAsync(string? category, string? search, string? diet);
    Task<Product?> GetProductByIdAsync(string id);
    Task<Product> CreateProductAsync(Product product);
    Task<Product?> UpdateProductAsync(string id, Product updates);
    Task<bool> DeleteProductAsync(string id);
}

public class ProductService : IProductService
{
    private readonly JsonDataStore _store;

    public ProductService(JsonDataStore store)
    {
        _store = store;
    }

    public Task<List<Product>> GetProductsAsync(string? category, string? search, string? diet)
    {
        var list = _store.Read(db =>
        {
            var custom = db.CustomProducts ?? new List<Product>();
            var deletedIds = new HashSet<string>(db.DeletedCatalogProductIds ?? new List<string>(), StringComparer.OrdinalIgnoreCase);

            var result = custom.Where(p => !deletedIds.Contains(p.Id)).ToList();

            if (!string.IsNullOrWhiteSpace(category) && !category.Equals("All Dishes", StringComparison.OrdinalIgnoreCase) && !category.Equals("All", StringComparison.OrdinalIgnoreCase))
            {
                result = result.Where(p => p.Category.Equals(category, StringComparison.OrdinalIgnoreCase)).ToList();
            }

            if (!string.IsNullOrWhiteSpace(diet) && !diet.Equals("All", StringComparison.OrdinalIgnoreCase))
            {
                result = result.Where(p => p.Dietary != null && p.Dietary.Any(d => d.Equals(diet, StringComparison.OrdinalIgnoreCase))).ToList();
            }

            if (!string.IsNullOrWhiteSpace(search))
            {
                var q = search.Trim().ToLowerInvariant();
                result = result.Where(p =>
                    p.Name.ToLowerInvariant().Contains(q) ||
                    p.ShortDescription.ToLowerInvariant().Contains(q) ||
                    (p.Tags != null && p.Tags.Any(t => t.ToLowerInvariant().Contains(q)))
                ).ToList();
            }

            return result;
        });

        return Task.FromResult(list);
    }

    public Task<Product?> GetProductByIdAsync(string id)
    {
        var product = _store.Read(db =>
        {
            var custom = db.CustomProducts ?? new List<Product>();
            return custom.FirstOrDefault(p => p.Id.Equals(id, StringComparison.OrdinalIgnoreCase));
        });

        return Task.FromResult(product);
    }

    public Task<Product> CreateProductAsync(Product product)
    {
        if (string.IsNullOrWhiteSpace(product.Id))
        {
            var cleanSlug = System.Text.RegularExpressions.Regex.Replace(product.Name.ToLowerInvariant(), @"[^a-z0-9]+", "-").Trim('-');
            product.Id = $"{cleanSlug}-{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds().ToString().Substring(Math.Max(0, DateTimeOffset.UtcNow.ToUnixTimeMilliseconds().ToString().Length - 4))}";
        }

        product.CreatedAt = DateTime.UtcNow.ToString("o");
        if (product.Images == null || product.Images.Count == 0)
        {
            product.Images = new List<string> { "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800" };
        }

        var created = _store.Update(db =>
        {
            if (db.CustomProducts == null) db.CustomProducts = new List<Product>();
            db.CustomProducts.Insert(0, product);
            return product;
        });

        return Task.FromResult(created);
    }

    public Task<Product?> UpdateProductAsync(string id, Product updates)
    {
        var updated = _store.Update(db =>
        {
            if (db.CustomProducts == null) db.CustomProducts = new List<Product>();
            var idx = db.CustomProducts.FindIndex(p => p.Id.Equals(id, StringComparison.OrdinalIgnoreCase));
            if (idx == -1) return null;

            updates.Id = db.CustomProducts[idx].Id;
            db.CustomProducts[idx] = updates;
            return db.CustomProducts[idx];
        });

        return Task.FromResult(updated);
    }

    public Task<bool> DeleteProductAsync(string id)
    {
        var deleted = _store.Update(db =>
        {
            bool changed = false;
            if (db.CustomProducts != null)
            {
                var initLen = db.CustomProducts.Count;
                db.CustomProducts.RemoveAll(p => p.Id.Equals(id, StringComparison.OrdinalIgnoreCase));
                if (db.CustomProducts.Count < initLen) changed = true;
            }

            if (db.DeletedCatalogProductIds == null) db.DeletedCatalogProductIds = new List<string>();
            if (!db.DeletedCatalogProductIds.Contains(id, StringComparer.OrdinalIgnoreCase))
            {
                db.DeletedCatalogProductIds.Add(id);
                changed = true;
            }

            return changed;
        });

        return Task.FromResult(deleted);
    }
}
