using System.Text.Json.Serialization;
using FoodEat.Api.Models;

namespace FoodEat.Api.DTOs;

public class ProcessPaymentRequest
{
    [JsonPropertyName("amount")]
    public double Amount { get; set; }

    [JsonPropertyName("paymentMethod")]
    public string PaymentMethod { get; set; } = "card"; // card, upi, netbanking, cod, cash, razorpay, stripe

    [JsonPropertyName("orderId")]
    public string? OrderId { get; set; }

    [JsonPropertyName("customerName")]
    public string? CustomerName { get; set; }

    [JsonPropertyName("phone")]
    public string? Phone { get; set; }

    [JsonPropertyName("email")]
    public string? Email { get; set; }

    [JsonPropertyName("upiId")]
    public string? UpiId { get; set; }

    [JsonPropertyName("utrNumber")]
    public string? UtrNumber { get; set; }

    [JsonPropertyName("upiAppUsed")]
    public string? UpiAppUsed { get; set; }

    [JsonPropertyName("qrCodeScanned")]
    public bool? QrCodeScanned { get; set; }

    [JsonPropertyName("cardLast4")]
    public string? CardLast4 { get; set; }
}

public class VerifyUpiPaymentRequest
{
    [JsonPropertyName("utrNumber")]
    public string? UtrNumber { get; set; }
}

public class PublicPaymentConfigResponse
{
    [JsonPropertyName("success")]
    public bool Success { get; set; } = true;

    [JsonPropertyName("isUpiQrEnabled")]
    public bool IsUpiQrEnabled { get; set; } = true;

    [JsonPropertyName("isOnlineGatewayEnabled")]
    public bool IsOnlineGatewayEnabled { get; set; } = true;

    [JsonPropertyName("isCodEnabled")]
    public bool IsCodEnabled { get; set; } = true;

    [JsonPropertyName("isCardOnDeliveryEnabled")]
    public bool IsCardOnDeliveryEnabled { get; set; } = true;

    [JsonPropertyName("businessUpiId")]
    public string BusinessUpiId { get; set; } = "foodeat.royal@okhdfcbank";

    [JsonPropertyName("payeeName")]
    public string PayeeName { get; set; } = "FoodEat Royal Kitchen & Catering";

    [JsonPropertyName("qrCodeImageUrl")]
    public string? QrCodeImageUrl { get; set; }

    [JsonPropertyName("upiInstructions")]
    public string UpiInstructions { get; set; } = string.Empty;

    [JsonPropertyName("mode")]
    public string Mode { get; set; } = "test";

    [JsonPropertyName("razorpayKeyId")]
    public string? RazorpayKeyId { get; set; }

    [JsonPropertyName("stripePublishableKey")]
    public string? StripePublishableKey { get; set; }

    [JsonPropertyName("autoApproveUpi")]
    public bool AutoApproveUpi { get; set; } = true;

    [JsonPropertyName("autoVerifyTimeoutSeconds")]
    public int AutoVerifyTimeoutSeconds { get; set; } = 4;

    [JsonPropertyName("qrTheme")]
    public string QrTheme { get; set; } = "royal-gold";
}

public class AutoDetectPaymentRequest
{
    [JsonPropertyName("orderId")]
    public string? OrderId { get; set; }

    [JsonPropertyName("utrNumber")]
    public string? UtrNumber { get; set; }

    [JsonPropertyName("upiAppUsed")]
    public string? UpiAppUsed { get; set; }

    [JsonPropertyName("amount")]
    public double? Amount { get; set; }
}

public class ProcessPaymentResponse
{
    [JsonPropertyName("success")]
    public bool Success { get; set; }

    [JsonPropertyName("message")]
    public string Message { get; set; } = string.Empty;

    [JsonPropertyName("transactionId")]
    public string TransactionId { get; set; } = string.Empty;

    [JsonPropertyName("amount")]
    public double Amount { get; set; }

    [JsonPropertyName("status")]
    public string Status { get; set; } = "COMPLETED"; // COMPLETED, PENDING, PENDING_COD, FAILED

    [JsonPropertyName("paymentMethod")]
    public string PaymentMethod { get; set; } = "card";

    [JsonPropertyName("transactionRef")]
    public string? TransactionRef { get; set; }

    [JsonPropertyName("timestamp")]
    public string Timestamp { get; set; } = DateTime.UtcNow.ToString("o");
}

public class VerifyPaymentRequest
{
    [JsonPropertyName("transactionId")]
    public string TransactionId { get; set; } = string.Empty;

    [JsonPropertyName("gatewayOrderId")]
    public string? GatewayOrderId { get; set; }

    [JsonPropertyName("gatewayPaymentId")]
    public string? GatewayPaymentId { get; set; }

    [JsonPropertyName("signature")]
    public string? Signature { get; set; }
}

public class RefundPaymentRequest
{
    [JsonPropertyName("reason")]
    public string Reason { get; set; } = "Customer Cancellation";

    [JsonPropertyName("amount")]
    public double? Amount { get; set; } // Null for full refund
}

public class PaymentSummaryResponse
{
    [JsonPropertyName("success")]
    public bool Success { get; set; } = true;

    [JsonPropertyName("totalBilledRevenue")]
    public double TotalBilledRevenue { get; set; }

    [JsonPropertyName("onlinePaidTotal")]
    public double OnlinePaidTotal { get; set; }

    [JsonPropertyName("codCollectedTotal")]
    public double CodCollectedTotal { get; set; }

    [JsonPropertyName("codPendingTotal")]
    public double CodPendingTotal { get; set; }

    [JsonPropertyName("refundedTotal")]
    public double RefundedTotal { get; set; }

    [JsonPropertyName("totalGstCollected")]
    public double TotalGstCollected { get; set; }

    [JsonPropertyName("totalTransactions")]
    public int TotalTransactions { get; set; }

    [JsonPropertyName("paidTransactionsCount")]
    public int PaidTransactionsCount { get; set; }

    [JsonPropertyName("pendingCodCount")]
    public int PendingCodCount { get; set; }
}

public class TransactionListResponse
{
    [JsonPropertyName("success")]
    public bool Success { get; set; } = true;

    [JsonPropertyName("count")]
    public int Count { get; set; }

    [JsonPropertyName("transactions")]
    public List<PaymentTransaction> Transactions { get; set; } = new();
}

public class DailyClosingReportResponse
{
    [JsonPropertyName("success")]
    public bool Success { get; set; } = true;

    [JsonPropertyName("date")]
    public string Date { get; set; } = DateTime.UtcNow.ToString("yyyy-MM-dd");

    [JsonPropertyName("summary")]
    public PaymentSummaryResponse Summary { get; set; } = new();

    [JsonPropertyName("transactions")]
    public List<PaymentTransaction> Transactions { get; set; } = new();
}
