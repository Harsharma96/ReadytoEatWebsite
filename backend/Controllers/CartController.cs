using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using FoodEat.Api.DTOs;
using FoodEat.Api.Services;

namespace FoodEat.Api.Controllers;

[ApiController]
[Route("api/cart")]
public class CartController : ControllerBase
{
    private readonly IAdminService _adminService;

    public CartController(IAdminService adminService)
    {
        _adminService = adminService;
    }

    [HttpGet]
    public async Task<IActionResult> GetCart([FromQuery] string? guestId)
    {
        var userId = User.FindFirst("id")?.Value ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? guestId ?? "guest";
        var cart = await _adminService.GetCartAsync(userId);
        return Ok(new
        {
            success = true,
            cart
        });
    }

    [HttpPost]
    public async Task<IActionResult> SyncCart([FromBody] SyncCartRequest request)
    {
        var userId = User.FindFirst("id")?.Value ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? request.GuestId ?? "guest";
        var cart = await _adminService.SyncCartAsync(userId, request.Items);
        return Ok(new
        {
            success = true,
            message = "Cart synced successfully.",
            cart
        });
    }

    [HttpDelete]
    public async Task<IActionResult> ClearCart([FromQuery] string? guestId)
    {
        var userId = User.FindFirst("id")?.Value ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? guestId ?? "guest";
        var cleared = await _adminService.ClearCartAsync(userId);
        return Ok(new
        {
            success = true,
            message = "Cart cleared successfully."
        });
    }
}
