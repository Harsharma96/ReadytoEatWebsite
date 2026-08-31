using System.Text.Json.Serialization;

namespace FoodEat.Api.Models;

public class PaymentTransaction
{
    [JsonPropertyName("id")]
    public string Id { get; set; } = string.Empty;

    [JsonPropertyName("orderId")]
    public string OrderId { get; set; } = string.Empty;

    [JsonPropertyName("customerName")]
    public string CustomerName { get; set; } = string.Empty;

    [JsonPropertyName("phone")]
    public string Phone { get; set; } = string.Empty;

    [JsonPropertyName("paymentMethod")]
    public string PaymentMethod { get; set; } = "card";

    [JsonPropertyName("subtotal")]
    public double Subtotal { get; set; }

    [JsonPropertyName("taxAmount")]
    public double TaxAmount { get; set; }

    [JsonPropertyName("discountAmount")]
    public double DiscountAmount { get; set; }

    [JsonPropertyName("deliveryFee")]
    public double DeliveryFee { get; set; }

    [JsonPropertyName("totalAmount")]
    public double TotalAmount { get; set; }

    [JsonPropertyName("paymentStatus")]
    public string PaymentStatus { get; set; } = "PAID"; // PAID, PENDING, PENDING_COD, REFUNDED, CANCELLED

    [JsonPropertyName("transactionRef")]
    public string? TransactionRef { get; set; }

    [JsonPropertyName("utrNumber")]
    public string? UtrNumber { get; set; }

    [JsonPropertyName("upiAppUsed")]
    public string? UpiAppUsed { get; set; }

    [JsonPropertyName("qrCodeScanned")]
    public bool? QrCodeScanned { get; set; }

    [JsonPropertyName("itemsSummary")]
    public string? ItemsSummary { get; set; }

    [JsonPropertyName("refundReason")]
    public string? RefundReason { get; set; }

    [JsonPropertyName("refundAmount")]
    public double? RefundAmount { get; set; }

    [JsonPropertyName("refundedAt")]
    public string? RefundedAt { get; set; }

    [JsonPropertyName("createdAt")]
    public string CreatedAt { get; set; } = DateTime.UtcNow.ToString("o");

    [JsonPropertyName("paidAt")]
    public string? PaidAt { get; set; }
}

public class PaymentGatewaySettings
{
    [JsonPropertyName("isRazorpayEnabled")]
    public bool IsRazorpayEnabled { get; set; } = true;

    [JsonPropertyName("isStripeEnabled")]
    public bool IsStripeEnabled { get; set; } = true;

    [JsonPropertyName("isUpiEnabled")]
    public bool IsUpiEnabled { get; set; } = true;

    [JsonPropertyName("isUpiQrEnabled")]
    public bool IsUpiQrEnabled { get; set; } = true;

    [JsonPropertyName("isOnlineGatewayEnabled")]
    public bool IsOnlineGatewayEnabled { get; set; } = true;

    [JsonPropertyName("isCodEnabled")]
    public bool IsCodEnabled { get; set; } = true;

    [JsonPropertyName("isCardOnDeliveryEnabled")]
    public bool IsCardOnDeliveryEnabled { get; set; } = true;

    [JsonPropertyName("mode")]
    public string Mode { get; set; } = "test"; // test or live

    [JsonPropertyName("currency")]
    public string Currency { get; set; } = "INR";

    [JsonPropertyName("businessUpiId")]
    public string BusinessUpiId { get; set; } = "foodeat.royal@okhdfcbank";

    [JsonPropertyName("payeeName")]
    public string PayeeName { get; set; } = "FoodEat Royal Kitchen & Catering";

    [JsonPropertyName("qrCodeImageUrl")]
    public string? QrCodeImageUrl { get; set; }

    [JsonPropertyName("upiInstructions")]
    public string UpiInstructions { get; set; } = "Scan this QR code with any UPI App (Google Pay, PhonePe, Paytm, BHIM) and enter your 12-digit UTR No. below.";

    [JsonPropertyName("razorpayKeyId")]
    public string RazorpayKeyId { get; set; } = "rzp_test_luxury_foodeat_2026";

    [JsonPropertyName("razorpayKeySecret")]
    public string RazorpayKeySecret { get; set; } = "secret_luxury_foodeat_2026";

    [JsonPropertyName("stripePublishableKey")]
    public string StripePublishableKey { get; set; } = "pk_test_luxury_foodeat_2026";

    [JsonPropertyName("stripeSecretKey")]
    public string StripeSecretKey { get; set; } = "sk_test_luxury_foodeat_2026";

    [JsonPropertyName("autoApproveCodThreshold")]
    public double AutoApproveCodThreshold { get; set; } = 2000;

    [JsonPropertyName("autoApproveUpi")]
    public bool AutoApproveUpi { get; set; } = true;

    [JsonPropertyName("autoVerifyTimeoutSeconds")]
    public int AutoVerifyTimeoutSeconds { get; set; } = 4;

    [JsonPropertyName("qrTheme")]
    public string QrTheme { get; set; } = "royal-gold"; // royal-gold, phonepe-blue, emerald-green
}
