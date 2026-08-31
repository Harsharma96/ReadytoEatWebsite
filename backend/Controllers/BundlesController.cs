using Microsoft.AspNetCore.Mvc;
using FoodEat.Api.Models;
using FoodEat.Api.Services;

namespace FoodEat.Api.Controllers;

[ApiController]
[Route("api/bundles")]
public class BundlesController : ControllerBase
{
    private readonly IAdminService _adminService;

    public BundlesController(IAdminService adminService)
    {
        _adminService = adminService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] bool admin = false)
    {
        var tiers = await _adminService.GetFeastBoxTiersAsync(admin);
        return Ok(new
        {
            success = true,
            count = tiers.Count,
            tiers,
            bundles = tiers
        });
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] FeastBoxTier tier)
    {
        if (tier.Count <= 0 || tier.DiscountPercent < 0)
        {
            return BadRequest(new { success = false, message = "Dish count and valid discount percent are required." });
        }

        var created = await _adminService.CreateFeastBoxTierAsync(tier);
        return StatusCode(201, new
        {
            success = true,
            message = "Feast Box Tier created successfully.",
            tier = created
        });
    }

    [HttpPut]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update([FromRoute] string? id, [FromBody] FeastBoxTier updates)
    {
        var targetId = !string.IsNullOrWhiteSpace(id) ? id : updates.Id;
        if (string.IsNullOrWhiteSpace(targetId))
        {
            return BadRequest(new { success = false, message = "id is required" });
        }

        var updated = await _adminService.UpdateFeastBoxTierAsync(targetId, updates);
        if (updated == null)
        {
            return NotFound(new { success = false, message = "Tier not found" });
        }

        return Ok(new
        {
            success = true,
            message = "Feast Box Tier updated successfully.",
            tier = updated
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

        var deleted = await _adminService.DeleteFeastBoxTierAsync(targetId);
        if (!deleted)
        {
            return NotFound(new { success = false, message = "Tier not found" });
        }

        return Ok(new
        {
            success = true,
            message = "Feast Box Tier deleted successfully."
        });
    }
}
