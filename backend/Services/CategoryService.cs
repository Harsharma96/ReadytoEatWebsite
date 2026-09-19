using FoodEat.Api.Data;
using FoodEat.Api.Models;

namespace FoodEat.Api.Services;

public interface ICategoryService
{
    Task<List<Category>> GetCategoriesAsync(bool adminOnly = false);
    Task<Category> CreateCategoryAsync(Category category);
    Task<Category?> UpdateCategoryAsync(string id, Category updates);
    Task<bool> DeleteCategoryAsync(string id);
}

public class CategoryService : ICategoryService
{
    private readonly JsonDataStore _store;

    public CategoryService(JsonDataStore store)
    {
        _store = store;
    }

    public Task<List<Category>> GetCategoriesAsync(bool adminOnly = false)
    {
        var list = _store.Read(db =>
        {
            var categories = db.Categories ?? new List<Category>();
            if (!adminOnly)
            {
                categories = categories.Where(c => c.IsActive).ToList();
            }
            return categories.OrderBy(c => c.Priority).ToList();
        });

        return Task.FromResult(list);
    }

    public Task<Category> CreateCategoryAsync(Category category)
    {
        if (string.IsNullOrWhiteSpace(category.Id))
        {
            category.Id = $"cat-{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}";
        }
        category.CreatedAt = DateTime.UtcNow.ToString("o");

        var created = _store.Update(db =>
        {
            if (db.Categories == null) db.Categories = new List<Category>();
            category.Priority = category.Priority > 0 ? category.Priority : db.Categories.Count + 1;
            db.Categories.Add(category);
            return category;
        });

        return Task.FromResult(created);
    }

    public Task<Category?> UpdateCategoryAsync(string id, Category updates)
    {
        var updated = _store.Update(db =>
        {
            if (db.Categories == null) return null;
            var idx = db.Categories.FindIndex(c => c.Id.Equals(id, StringComparison.OrdinalIgnoreCase));
            if (idx == -1) return null;

            var existing = db.Categories[idx];
            var oldName = existing.Name;

            if (!string.IsNullOrWhiteSpace(updates.Name)) existing.Name = updates.Name;
            if (!string.IsNullOrWhiteSpace(updates.Emoji)) existing.Emoji = updates.Emoji;
            if (!string.IsNullOrWhiteSpace(updates.Subtitle)) existing.Subtitle = updates.Subtitle;
            if (!string.IsNullOrWhiteSpace(updates.BgGradient)) existing.BgGradient = updates.BgGradient;
            if (!string.IsNullOrWhiteSpace(updates.BorderColor)) existing.BorderColor = updates.BorderColor;
            if (!string.IsNullOrWhiteSpace(updates.Accent)) existing.Accent = updates.Accent;
            if (updates.Priority > 0) existing.Priority = updates.Priority;
            existing.IsActive = updates.IsActive;

            // Cascade category rename to custom products
            if (!string.IsNullOrWhiteSpace(updates.Name) && !updates.Name.Equals(oldName, StringComparison.OrdinalIgnoreCase) && db.CustomProducts != null)
            {
                foreach (var prod in db.CustomProducts.Where(p => p.Category.Equals(oldName, StringComparison.OrdinalIgnoreCase)))
                {
                    prod.Category = existing.Name;
                }
            }

            db.Categories[idx] = existing;
            return db.Categories[idx];
        });

        return Task.FromResult(updated);
    }

    public Task<bool> DeleteCategoryAsync(string id)
    {
        var deleted = _store.Update(db =>
        {
            if (db.Categories == null) return false;
            var initLen = db.Categories.Count;
            db.Categories.RemoveAll(c => c.Id.Equals(id, StringComparison.OrdinalIgnoreCase));
            return db.Categories.Count < initLen;
        });

        return Task.FromResult(deleted);
    }
}
