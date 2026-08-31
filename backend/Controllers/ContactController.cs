using Microsoft.AspNetCore.Mvc;
using FoodEat.Api.Models;
using FoodEat.Api.Services;

namespace FoodEat.Api.Controllers;

[ApiController]
public class ContactController : ControllerBase
{
    private readonly IAdminService _adminService;

    public ContactController(IAdminService adminService)
    {
        _adminService = adminService;
    }

    [HttpGet("api/contact")]
    public async Task<IActionResult> GetAll()
    {
        var inquiries = await _adminService.GetInquiriesAsync();
        return Ok(new
        {
            success = true,
            count = inquiries.Count,
            inquiries
        });
    }

    [HttpPost("api/contact")]
    public async Task<IActionResult> Create([FromBody] ContactInquiry inquiry)
    {
        if (string.IsNullOrWhiteSpace(inquiry.Name) || string.IsNullOrWhiteSpace(inquiry.Email) || string.IsNullOrWhiteSpace(inquiry.Message))
        {
            return BadRequest(new { success = false, message = "Name, Email, and Message are required." });
        }

        var created = await _adminService.CreateInquiryAsync(inquiry);
        return StatusCode(201, new
        {
            success = true,
            message = "Your catering inquiry has been received! Our Master Chef concierge will contact you shortly. 👑",
            inquiry = created
        });
    }

    [HttpDelete("api/contact")]
    [HttpDelete("api/contact/{id}")]
    public async Task<IActionResult> Delete([FromRoute] string? id, [FromQuery] string? queryId)
    {
        var targetId = !string.IsNullOrWhiteSpace(id) ? id : queryId;
        if (string.IsNullOrWhiteSpace(targetId))
        {
            return BadRequest(new { success = false, message = "id is required" });
        }

        var deleted = await _adminService.DeleteInquiryAsync(targetId);
        if (!deleted)
        {
            return NotFound(new { success = false, message = "Inquiry not found" });
        }

        return Ok(new
        {
            success = true,
            message = "Inquiry deleted successfully."
        });
    }
}
