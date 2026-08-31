using Microsoft.AspNetCore.Mvc;
using FoodEat.Api.Services;

namespace FoodEat.Api.Controllers;

[ApiController]
[Route("api/newsletter")]
public class NewsletterController : ControllerBase
{
    private readonly IAdminService _adminService;

    public NewsletterController(IAdminService adminService)
    {
        _adminService = adminService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var subs = await _adminService.GetSubscribersAsync();
        return Ok(new
        {
            success = true,
            count = subs.Count,
            subscribers = subs
        });
    }

    public class SubscribeRequest
    {
        public string Email { get; set; } = string.Empty;
    }

    [HttpPost]
    public async Task<IActionResult> Subscribe([FromBody] SubscribeRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email))
        {
            return BadRequest(new { success = false, message = "Email is required." });
        }

        var result = await _adminService.SubscribeNewsletterAsync(request.Email);
        return Ok(result);
    }

    [HttpDelete]
    [HttpDelete("{email}")]
    public async Task<IActionResult> Delete([FromRoute] string? email, [FromQuery] string? queryEmail)
    {
        var targetEmail = !string.IsNullOrWhiteSpace(email) ? email : queryEmail;
        if (string.IsNullOrWhiteSpace(targetEmail))
        {
            return BadRequest(new { success = false, message = "Email is required." });
        }

        var deleted = await _adminService.DeleteSubscriberAsync(targetEmail);
        if (!deleted)
        {
            return NotFound(new { success = false, message = "Subscriber not found." });
        }

        return Ok(new
        {
            success = true,
            message = "Subscriber removed successfully."
        });
    }
}
