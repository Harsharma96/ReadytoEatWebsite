using System.Text.Json.Serialization;

namespace FoodEat.Api.Models;

public class OrderItem
{
    [JsonPropertyName("productId")]
    public string ProductId { get; set; } = string.Empty;

    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("price")]
    public double Price { get; set; }

    [JsonPropertyName("quantity")]
    public int Quantity { get; set; } = 1;

    [JsonPropertyName("image")]
    public string Image { get; set; } = string.Empty;
}

public class StatusHistoryItem
{
    [JsonPropertyName("status")]
    public string Status { get; set; } = "ORDER_RECEIVED";

    [JsonPropertyName("timestamp")]
    public string Timestamp { get; set; } = DateTime.UtcNow.ToString("o");

    [JsonPropertyName("note")]
    public string Note { get; set; } = string.Empty;
}

public class CourierLocation
{
    [JsonPropertyName("lat")]
    public double Lat { get; set; } = 28.6139;

    [JsonPropertyName("lng")]
    public double Lng { get; set; } = 77.2090;

    [JsonPropertyName("name")]
    public string Name { get; set; } = "Rameshwar Sharma (Desi Electric Thermal Pod #09)";

    [JsonPropertyName("vehicle")]
    public string Vehicle { get; set; } = "Electric Thermal Bike #09 (Connaught Place Hub)";
}

public class Order
{
    [JsonPropertyName("id")]
    public string Id { get; set; } = string.Empty;

    [JsonPropertyName("customerName")]
    public string CustomerName { get; set; } = string.Empty;

    [JsonPropertyName("email")]
    public string Email { get; set; } = string.Empty;

    [JsonPropertyName("phone")]
    public string Phone { get; set; } = string.Empty;

    [JsonPropertyName("address")]
    public string Address { get; set; } = string.Empty;

    [JsonPropertyName("aptSuite")]
    public string? AptSuite { get; set; }

    [JsonPropertyName("notes")]
    public string? Notes { get; set; }

    [JsonPropertyName("paymentMethod")]
    public string PaymentMethod { get; set; } = "card"; // upi, card, netbanking, cod, cash

    [JsonPropertyName("paymentStatus")]
    public string PaymentStatus { get; set; } = "PAID"; // PAID, PENDING_COD, PENDING, REFUNDED, CANCELLED

    [JsonPropertyName("transactionRef")]
    public string? TransactionRef { get; set; }

    [JsonPropertyName("utrNumber")]
    public string? UtrNumber { get; set; }

    [JsonPropertyName("upiAppUsed")]
    public string? UpiAppUsed { get; set; }

    [JsonPropertyName("paidAt")]
    public string? PaidAt { get; set; }

    [JsonPropertyName("items")]
    public List<OrderItem> Items { get; set; } = new();

    [JsonPropertyName("subtotal")]
    public double Subtotal { get; set; }

    [JsonPropertyName("discount")]
    public double Discount { get; set; }

    [JsonPropertyName("promoCode")]
    public string? PromoCode { get; set; }

    [JsonPropertyName("deliveryFee")]
    public double DeliveryFee { get; set; }

    [JsonPropertyName("tax")]
    public double Tax { get; set; }

    [JsonPropertyName("total")]
    public double Total { get; set; }

    [JsonPropertyName("status")]
    public string Status { get; set; } = "ORDER_RECEIVED"; // ORDER_RECEIVED, CHEF_PREPARING, WOOD_FIRED_BAKING, COURIER_DISPATCHED, DELIVERED

    [JsonPropertyName("statusHistory")]
    public List<StatusHistoryItem> StatusHistory { get; set; } = new();

    [JsonPropertyName("etaMinutes")]
    public int EtaMinutes { get; set; } = 22;

    [JsonPropertyName("createdAt")]
    public string CreatedAt { get; set; } = DateTime.UtcNow.ToString("o");

    [JsonPropertyName("courierLocation")]
    public CourierLocation? CourierLocation { get; set; }

    [JsonPropertyName("feedbackSubmitted")]
    public bool FeedbackSubmitted { get; set; } = false;

    [JsonPropertyName("isArchived")]
    public bool IsArchived { get; set; } = false;
}
