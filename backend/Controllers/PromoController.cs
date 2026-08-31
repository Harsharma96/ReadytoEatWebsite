using Microsoft.AspNetCore.Mvc;
using FoodEat.Api.DTOs;
using FoodEat.Api.Models;
using FoodEat.Api.Services;

namespace FoodEat.Api.Controllers;

[ApiController]
public class PromoController : ControllerBase
{
    private readonly IPromoService _promoService;

    public PromoController(IPromoService promoService)
    {
        _promoService = promoService;
    }

    [HttpGet("api/promo")]
    [HttpGet("api/admin/promos")]
    public async Task<IActionResult> GetAll()
    {
        var promos = await _promoService.GetPromosAsync();
        return Ok(new
        {
            success = true,
            count = promos.Count,
            promos
        });
    }

    [HttpGet("api/promo/flash")]
    public async Task<IActionResult> GetFlashPromo()
    {
        var promo = await _promoService.GetFlashPromoAsync();
        return Ok(new
        {
            success = true,
            promo
        });
    }

    [HttpPost("api/promo/validate")]
    public async Task<IActionResult> ValidatePromo([FromBody] ValidatePromoRequest request)
    {
        var result = await _promoService.ValidatePromoAsync(request);
        return Ok(result);
    }

    [HttpPost("api/promo")]
    public async Task<IActionResult> Create([FromBody] PromoCode promo)
    {
        if (string.IsNullOrWhiteSpace(promo.Code))
        {
            return BadRequest(new { success = false, message = "Promo code is required." });
        }

        var created = await _promoService.CreatePromoAsync(promo);
        return StatusCode(201, new
        {
            success = true,
            message = "Promo code created successfully.",
            promo = created
        });
    }

    [HttpPut("api/promo")]
    [HttpPut("api/promo/{code}")]
    public async Task<IActionResult> Update([FromRoute] string? code, [FromBody] PromoCode updates)
    {
        var targetCode = !string.IsNullOrWhiteSpace(code) ? code : updates.Code;
        if (string.IsNullOrWhiteSpace(targetCode))
        {
            return BadRequest(new { success = false, message = "Promo code is required." });
        }

        var updated = await _promoService.UpdatePromoAsync(targetCode, updates);
        if (updated == null)
        {
            return NotFound(new { success = false, message = "Promo code not found." });
        }

        return Ok(new
        {
            success = true,
            message = "Promo code updated successfully.",
            promo = updated
        });
    }

    [HttpDelete("api/promo")]
    [HttpDelete("api/promo/{code}")]
    public async Task<IActionResult> Delete([FromRoute] string? code, [FromQuery] string? queryCode)
    {
        var targetCode = !string.IsNullOrWhiteSpace(code) ? code : queryCode;
        if (string.IsNullOrWhiteSpace(targetCode))
        {
            return BadRequest(new { success = false, message = "Promo code is required." });
        }

        var deleted = await _promoService.DeletePromoAsync(targetCode);
        if (!deleted)
        {
            return NotFound(new { success = false, message = "Promo code not found." });
        }

        return Ok(new
        {
            success = true,
            message = "Promo code deleted successfully."
        });
    }
}
