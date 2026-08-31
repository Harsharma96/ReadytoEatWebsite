using Microsoft.AspNetCore.Mvc;
using FoodEat.Api.Models;
using FoodEat.Api.Services;

namespace FoodEat.Api.Controllers;

[ApiController]
[Route("api/settings")]
public class SettingsController : ControllerBase
{
    private readonly IAdminService _adminService;

    public SettingsController(IAdminService adminService)
    {
        _adminService = adminService;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var settings = await _adminService.GetStoreSettingsAsync();
        return Ok(new
        {
            success = true,
            settings
        });
    }

    [HttpPut]
    [HttpPost]
    public async Task<IActionResult> Update([FromBody] StoreSettings updates)
    {
        var updated = await _adminService.UpdateStoreSettingsAsync(updates);
        return Ok(new
        {
            success = true,
            message = "Store & GST settings updated successfully.",
            settings = updated
        });
    }
}
