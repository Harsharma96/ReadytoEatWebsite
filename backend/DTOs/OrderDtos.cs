using System.Text.Json.Serialization;
using FoodEat.Api.Models;

namespace FoodEat.Api.DTOs;

public class CreateOrderRequest
{
    [JsonPropertyName("customerName")]
    public string CustomerName { get; set; } = string.Empty;

    [JsonPropertyName("email")]
    public string? Email { get; set; }

    [JsonPropertyName("phone")]
    public string Phone { get; set; } = string.Empty;

    [JsonPropertyName("address")]
    public string Address { get; set; } = string.Empty;

    [JsonPropertyName("aptSuite")]
    public string? AptSuite { get; set; }

    [JsonPropertyName("notes")]
    public string? Notes { get; set; }

    [JsonPropertyName("paymentMethod")]
    public string PaymentMethod { get; set; } = "card";

    [JsonPropertyName("paymentStatus")]
    public string? PaymentStatus { get; set; }

    [JsonPropertyName("transactionRef")]
    public string? TransactionRef { get; set; }

    [JsonPropertyName("utrNumber")]
    public string? UtrNumber { get; set; }

    [JsonPropertyName("upiAppUsed")]
    public string? UpiAppUsed { get; set; }

    [JsonPropertyName("qrCodeScanned")]
    public bool? QrCodeScanned { get; set; }

    [JsonPropertyName("items")]
    public List<OrderItem> Items { get; set; } = new();

    [JsonPropertyName("subtotal")]
    public double Subtotal { get; set; }

    [JsonPropertyName("discount")]
    public double Discount { get; set; } = 0;

    [JsonPropertyName("promoCode")]
    public string? PromoCode { get; set; }

    [JsonPropertyName("deliveryFee")]
    public double? DeliveryFee { get; set; }

    [JsonPropertyName("tax")]
    public double? Tax { get; set; }

    [JsonPropertyName("total")]
    public double? Total { get; set; }
}

public class UpdateOrderStatusRequest
{
    [JsonPropertyName("status")]
    public string Status { get; set; } = string.Empty;

    [JsonPropertyName("note")]
    public string? Note { get; set; }
}

public class OrderListResponse
{
    [JsonPropertyName("success")]
    public bool Success { get; set; } = true;

    [JsonPropertyName("count")]
    public int Count { get; set; }

    [JsonPropertyName("orders")]
    public List<Order> Orders { get; set; } = new();
}

public class SingleOrderResponse
{
    [JsonPropertyName("success")]
    public bool Success { get; set; }

    [JsonPropertyName("message")]
    public string? Message { get; set; }

    [JsonPropertyName("orderId")]
    public string? OrderId { get; set; }

    [JsonPropertyName("order")]
    public Order? Order { get; set; }
}
