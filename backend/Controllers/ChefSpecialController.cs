using Microsoft.AspNetCore.Mvc;
using FoodEat.Api.Models;
using FoodEat.Api.Services;

namespace FoodEat.Api.Controllers;

[ApiController]
[Route("api/chef-special")]
public class ChefSpecialController : ControllerBase
{
    private readonly IAdminService _adminService;

    public ChefSpecialController(IAdminService adminService)
    {
        _adminService = adminService;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var config = await _adminService.GetChefSpecialAsync();
        return Ok(new
        {
            success = true,
            chefSpecial = config,
            special = config
        });
    }

    [HttpPost]
    [HttpPut]
    public async Task<IActionResult> Update([FromBody] ChefSpecialConfig updates)
    {
        var updated = await _adminService.UpdateChefSpecialAsync(updates);
        return Ok(new
        {
            success = true,
            message = "Chef Special Spotlight updated successfully! 👑",
            chefSpecial = updated,
            special = updated
        });
    }

    [HttpDelete]
    public async Task<IActionResult> Disable()
    {
        var current = await _adminService.GetChefSpecialAsync() ?? new ChefSpecialConfig();
        current.IsActive = false;
        var updated = await _adminService.UpdateChefSpecialAsync(current);
        return Ok(new
        {
            success = true,
            message = "Chef Special disabled.",
            chefSpecial = updated
        });
    }
}
