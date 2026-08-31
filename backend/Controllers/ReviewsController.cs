using Microsoft.AspNetCore.Mvc;
using FoodEat.Api.Models;
using FoodEat.Api.Services;

namespace FoodEat.Api.Controllers;

[ApiController]
public class ReviewsController : ControllerBase
{
    private readonly IAdminService _adminService;

    public ReviewsController(IAdminService adminService)
    {
        _adminService = adminService;
    }

    [HttpGet("api/reviews")]
    [HttpGet("api/feedback")]
    public async Task<IActionResult> GetReviews()
    {
        var reviews = await _adminService.GetReviewsAsync();
        return Ok(new
        {
            success = true,
            count = reviews.Count,
            reviews,
            feedback = reviews
        });
    }

    [HttpPost("api/reviews")]
    [HttpPost("api/feedback")]
    public async Task<IActionResult> CreateReview([FromBody] FeedbackReview review)
    {
        if (string.IsNullOrWhiteSpace(review.CustomerName) && !string.IsNullOrWhiteSpace(review.UserName))
        {
            review.CustomerName = review.UserName;
        }

        var created = await _adminService.CreateReviewAsync(review);
        return StatusCode(201, new
        {
            success = true,
            message = "Thank you for your royal feedback! 🌟",
            review = created,
            feedback = created
        });
    }

    [HttpDelete("api/feedback")]
    [HttpDelete("api/feedback/{id}")]
    [HttpDelete("api/admin/feedback/{id}")]
    public async Task<IActionResult> DeleteFeedback([FromRoute] string? id, [FromQuery] string? queryId)
    {
        var targetId = !string.IsNullOrWhiteSpace(id) ? id : queryId;
        if (string.IsNullOrWhiteSpace(targetId))
        {
            return BadRequest(new { success = false, message = "id is required" });
        }

        var deleted = await _adminService.DeleteReviewAsync(targetId);
        if (!deleted)
        {
            return NotFound(new { success = false, message = "Feedback review not found" });
        }

        return Ok(new
        {
            success = true,
            message = "Feedback review deleted successfully."
        });
    }
}
