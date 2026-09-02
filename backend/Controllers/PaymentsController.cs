using Microsoft.AspNetCore.Mvc;
using FoodEat.Api.DTOs;
using FoodEat.Api.Models;
using FoodEat.Api.Services;

namespace FoodEat.Api.Controllers;

[ApiController]
public class PaymentsController : ControllerBase
{
    private readonly IPaymentService _paymentService;

    public PaymentsController(IPaymentService paymentService)
    {
        _paymentService = paymentService;
    }

    // ==================== PUBLIC PAYMENT APIS ====================

    [HttpGet("api/payments/config")]
    [ResponseCache(NoStore = true, Location = ResponseCacheLocation.None)]
    public async Task<IActionResult> GetPublicPaymentConfig()
    {
        Response.Headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
        Response.Headers["Pragma"] = "no-cache";
        Response.Headers["Expires"] = "0";
        var config = await _paymentService.GetPublicPaymentConfigAsync();
        return Ok(new
        {
            success = true,
            config,
            isUpiQrEnabled = config.IsUpiQrEnabled,
            isOnlineGatewayEnabled = config.IsOnlineGatewayEnabled,
            isCodEnabled = config.IsCodEnabled,
            isCardOnDeliveryEnabled = config.IsCardOnDeliveryEnabled,
            businessUpiId = config.BusinessUpiId,
            payeeName = config.PayeeName,
            qrCodeImageUrl = config.QrCodeImageUrl,
            upiInstructions = config.UpiInstructions,
            mode = config.Mode,
            razorpayKeyId = config.RazorpayKeyId,
            stripePublishableKey = config.StripePublishableKey
        });
    }

    [HttpPost("api/payments/process")]
    public async Task<IActionResult> ProcessPayment([FromBody] ProcessPaymentRequest request)
    {
        var result = await _paymentService.ProcessPaymentAsync(request);
        return Ok(result);
    }

    [HttpPost("api/payments/verify")]
    public async Task<IActionResult> VerifyPayment([FromBody] VerifyPaymentRequest request)
    {
        var result = await _paymentService.VerifyPaymentAsync(request);
        return Ok(result);
    }

    [HttpPost("api/payments/auto-detect")]
    public async Task<IActionResult> AutoDetectPayment([FromBody] AutoDetectPaymentRequest request)
    {
        var result = await _paymentService.AutoDetectPaymentAsync(request);
        return Ok(result);
    }

    // ==================== ADMIN PAYMENT MANAGEMENT APIS ====================

    [HttpGet("api/admin/payments")]
    public async Task<IActionResult> GetTransactions([FromQuery] string? status, [FromQuery] bool archive = false, [FromQuery] int days = 7)
    {
        var transactions = await _paymentService.GetTransactionsAsync(status, archive, days);
        return Ok(new TransactionListResponse
        {
            Success = true,
            Count = transactions.Count,
            Transactions = transactions
        });
    }

    [HttpGet("api/admin/payments/summary")]
    public async Task<IActionResult> GetPaymentSummary()
    {
        var summary = await _paymentService.GetPaymentSummaryAsync();
        return Ok(summary);
    }

    [HttpPost("api/admin/payments/{orderId}/approve-cod")]
    public async Task<IActionResult> ApproveCodPayment(string orderId)
    {
        if (string.IsNullOrWhiteSpace(orderId))
        {
            return BadRequest(new { success = false, message = "orderId is required" });
        }

        var result = await _paymentService.ApproveCodPaymentAsync(orderId);
        if (!result.Success)
        {
            return NotFound(result);
        }
        return Ok(result);
    }

    [HttpPost("api/admin/payments/{orderId}/verify-upi")]
    public async Task<IActionResult> VerifyUpiPayment(string orderId, [FromBody] VerifyUpiPaymentRequest? request)
    {
        if (string.IsNullOrWhiteSpace(orderId))
        {
            return BadRequest(new { success = false, message = "orderId is required" });
        }

        var result = await _paymentService.VerifyUpiPaymentAsync(orderId, request?.UtrNumber);
        if (!result.Success)
        {
            return NotFound(result);
        }
        return Ok(result);
    }

    [HttpPost("api/admin/payments/{orderId}/refund")]
    public async Task<IActionResult> RefundPayment(string orderId, [FromBody] RefundPaymentRequest request)
    {
        if (string.IsNullOrWhiteSpace(orderId))
        {
            return BadRequest(new { success = false, message = "orderId is required" });
        }

        var result = await _paymentService.RefundPaymentAsync(orderId, request);
        if (!result.Success)
        {
            return NotFound(result);
        }
        return Ok(result);
    }

    [HttpDelete("api/admin/payments")]
    public async Task<IActionResult> DeleteTransaction([FromQuery] string orderId)
    {
        if (string.IsNullOrWhiteSpace(orderId))
        {
            return BadRequest(new { success = false, message = "orderId is required" });
        }

        var deleted = await _paymentService.DeleteTransactionAsync(orderId);
        if (!deleted)
        {
            return NotFound(new { success = false, message = "Transaction / Order not found" });
        }

        return Ok(new
        {
            success = true,
            message = $"Transaction for order #{orderId} deleted successfully."
        });
    }

    [HttpGet("api/admin/payments/gateways")]
    public async Task<IActionResult> GetGatewaySettings()
    {
        var settings = await _paymentService.GetGatewaySettingsAsync();
        return Ok(new { success = true, settings });
    }

    [HttpPut("api/admin/payments/gateways")]
    [HttpPost("api/admin/payments/gateways")]
    public async Task<IActionResult> UpdateGatewaySettings([FromBody] PaymentGatewaySettings settings)
    {
        var updated = await _paymentService.UpdateGatewaySettingsAsync(settings);
        return Ok(new
        {
            success = true,
            message = "Payment gateway settings updated successfully.",
            settings = updated
        });
    }

    [HttpGet("api/admin/payments/closing-report")]
    public async Task<IActionResult> GetDailyClosingReport()
    {
        var report = await _paymentService.GetDailyClosingReportAsync();
        return Ok(report);
    }
}
