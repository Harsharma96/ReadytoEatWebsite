using Microsoft.AspNetCore.Mvc;
using FoodEat.Api.Models;
using FoodEat.Api.Services;

namespace FoodEat.Api.Controllers;

[ApiController]
[Route("api/categories")]
public class CategoriesController : ControllerBase
{
    private readonly ICategoryService _categoryService;

    public CategoriesController(ICategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] bool admin = false)
    {
        var categories = await _categoryService.GetCategoriesAsync(admin);
        return Ok(new
        {
            success = true,
            count = categories.Count,
            categories
        });
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Category category)
    {
        if (string.IsNullOrWhiteSpace(category.Name))
        {
            return BadRequest(new { success = false, message = "Category name is required." });
        }

        var created = await _categoryService.CreateCategoryAsync(category);
        return StatusCode(201, new
        {
            success = true,
            message = "Category created successfully.",
            category = created
        });
    }

    [HttpPut]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update([FromRoute] string? id, [FromBody] Category updates)
    {
        var targetId = !string.IsNullOrWhiteSpace(id) ? id : updates.Id;
        if (string.IsNullOrWhiteSpace(targetId))
        {
            return BadRequest(new { success = false, message = "Category ID is required." });
        }

        var updated = await _categoryService.UpdateCategoryAsync(targetId, updates);
        if (updated == null)
        {
            return NotFound(new { success = false, message = "Category not found." });
        }

        return Ok(new
        {
            success = true,
            message = "Category updated successfully.",
            category = updated
        });
    }

    [HttpDelete]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete([FromRoute] string? id, [FromQuery] string? queryId)
    {
        var targetId = !string.IsNullOrWhiteSpace(id) ? id : queryId;
        if (string.IsNullOrWhiteSpace(targetId))
        {
            return BadRequest(new { success = false, message = "Category ID is required." });
        }

        var deleted = await _categoryService.DeleteCategoryAsync(targetId);
        if (!deleted)
        {
            return NotFound(new { success = false, message = "Category not found." });
        }

        return Ok(new
        {
            success = true,
            message = "Category deleted successfully."
        });
    }
}
