using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using FoodEat.Api.DTOs;
using FoodEat.Api.Services;

namespace FoodEat.Api.Controllers;

[ApiController]
[Route("api/admin")]
public class AdminController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly IAdminService _adminService;
    private readonly IPaymentService _paymentService;

    public AdminController(IAuthService authService, IAdminService adminService, IPaymentService paymentService)
    {
        _authService = authService;
        _adminService = adminService;
        _paymentService = paymentService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> AdminLogin([FromBody] LoginRequest request)
    {
        var ip = HttpContext.Connection.RemoteIpAddress?.ToString()
                 ?? HttpContext.Request.Headers["X-Forwarded-For"].FirstOrDefault()
                 ?? "unknown";

        var result = await _authService.AdminLoginAsync(request, ip);
        if (!result.Success)
        {
            if (result.Message.Contains("Too many failed attempts"))
            {
                return StatusCode(429, result);
            }
            return Unauthorized(result);
        }
        return Ok(result);
    }

    [HttpGet("verify")]
    [Authorize]
    public async Task<IActionResult> VerifyAdmin()
    {
        var userId = User.FindFirst("id")?.Value ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var role = User.FindFirst(ClaimTypes.Role)?.Value;

        if (string.IsNullOrEmpty(userId) || !string.Equals(role, "admin", StringComparison.OrdinalIgnoreCase))
        {
            return StatusCode(403, new { success = false, message = "Access denied. Admin privileges required." });
        }

        var profile = await _authService.GetProfileAsync(userId);
        return Ok(new { success = true, user = profile });
    }

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var stats = await _adminService.GetAdminStatsAsync();
        return Ok(stats);
    }

    [HttpGet("inquiries")]
    public async Task<IActionResult> GetInquiries()
    {
        var inquiries = await _adminService.GetInquiriesAsync();
        return Ok(new { success = true, count = inquiries.Count, inquiries });
    }

    [HttpDelete("inquiries")]
    public async Task<IActionResult> DeleteInquiry([FromQuery] string id)
    {
        if (string.IsNullOrWhiteSpace(id))
        {
            return BadRequest(new { success = false, message = "id is required" });
        }
        var deleted = await _adminService.DeleteInquiryAsync(id);
        if (!deleted) return NotFound(new { success = false, message = "Inquiry not found" });
        return Ok(new { success = true, message = "Inquiry deleted successfully" });
    }

    [HttpGet("subscribers")]
    public async Task<IActionResult> GetSubscribers()
    {
        var subscribers = await _adminService.GetSubscribersAsync();
        return Ok(new { success = true, count = subscribers.Count, subscribers });
    }

    [HttpDelete("subscribers")]
    public async Task<IActionResult> DeleteSubscriber([FromQuery] string email)
    {
        if (string.IsNullOrWhiteSpace(email))
        {
            return BadRequest(new { success = false, message = "email is required" });
        }
        var deleted = await _adminService.DeleteSubscriberAsync(email);
        if (!deleted) return NotFound(new { success = false, message = "Subscriber not found" });
        return Ok(new { success = true, message = "Subscriber removed successfully" });
    }

    [HttpPost("day-lock")]
    public async Task<IActionResult> LockDayClosing()
    {
        var closingReport = await _paymentService.GetDailyClosingReportAsync();
        return Ok(new
        {
            success = true,
            message = "Financial day locked and daily shift closing report generated.",
            report = closingReport
        });
    }
}
