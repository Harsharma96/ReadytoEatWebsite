using Microsoft.AspNetCore.Mvc;
using FoodEat.Api.Models;
using FoodEat.Api.Services;

namespace FoodEat.Api.Controllers;

[ApiController]
[Route("api/trending")]
public class TrendingController : ControllerBase
{
    private readonly IAdminService _adminService;

    public TrendingController(IAdminService adminService)
    {
        _adminService = adminService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] bool admin = false)
    {
        var spotlights = await _adminService.GetTrendingSpotlightsAsync(admin);
        return Ok(new
        {
            success = true,
            count = spotlights.Count,
            spotlights
        });
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] TrendingSpotlightItem item)
    {
        if (string.IsNullOrWhiteSpace(item.ProductId))
        {
            return BadRequest(new { success = false, message = "productId is required" });
        }

        var created = await _adminService.CreateTrendingSpotlightAsync(item);
        return StatusCode(201, new
        {
            success = true,
            message = "Trending spotlight added successfully.",
            spotlight = created
        });
    }

    [HttpPut]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update([FromRoute] string? id, [FromBody] TrendingSpotlightItem updates)
    {
        var targetId = !string.IsNullOrWhiteSpace(id) ? id : updates.Id;
        if (string.IsNullOrWhiteSpace(targetId))
        {
            return BadRequest(new { success = false, message = "id is required" });
        }

        var updated = await _adminService.UpdateTrendingSpotlightAsync(targetId, updates);
        if (updated == null)
        {
            return NotFound(new { success = false, message = "Spotlight not found" });
        }

        return Ok(new
        {
            success = true,
            message = "Trending spotlight updated.",
            spotlight = updated
        });
    }

    [HttpDelete]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete([FromRoute] string? id, [FromQuery] string? queryId)
    {
        var targetId = !string.IsNullOrWhiteSpace(id) ? id : queryId;
        if (string.IsNullOrWhiteSpace(targetId))
        {
            return BadRequest(new { success = false, message = "id is required" });
        }

        var deleted = await _adminService.DeleteTrendingSpotlightAsync(targetId);
        if (!deleted)
        {
            return NotFound(new { success = false, message = "Spotlight not found" });
        }

        return Ok(new
        {
            success = true,
            message = "Removed from trending spotlights."
        });
    }
}
