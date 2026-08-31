using FoodEat.Api.Data;
using FoodEat.Api.DTOs;
using FoodEat.Api.Models;

namespace FoodEat.Api.Services;

public interface IOrderService
{
    Task<List<Order>> GetOrdersAsync();
    Task<Order?> GetOrderByIdAsync(string id);
    Task<SingleOrderResponse> CreateOrderAsync(CreateOrderRequest request);
    Task<SingleOrderResponse> UpdateOrderStatusAsync(string id, UpdateOrderStatusRequest request);
    Task<SingleOrderResponse> UpdateOrderAsync(string id, Order updates);
    Task<bool> DeleteOrderAsync(string id);
}

public class OrderService : IOrderService
{
    private readonly JsonDataStore _store;

    public OrderService(JsonDataStore store)
    {
        _store = store;
    }

    public Task<List<Order>> GetOrdersAsync()
    {
        var orders = _store.Read(db => (db.Orders ?? new List<Order>())
            .Where(o => !o.IsArchived)
            .OrderByDescending(o => DateTime.TryParse(o.CreatedAt, out var dt) ? dt : DateTime.MinValue)
            .ToList());
        return Task.FromResult(orders);
    }

    public Task<Order?> GetOrderByIdAsync(string id)
    {
        var order = _store.Read(db => (db.Orders ?? new List<Order>())
            .FirstOrDefault(o => o.Id.Equals(id, StringComparison.OrdinalIgnoreCase)));
        return Task.FromResult(order);
    }

    public Task<SingleOrderResponse> CreateOrderAsync(CreateOrderRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.CustomerName) || string.IsNullOrWhiteSpace(request.Phone) || string.IsNullOrWhiteSpace(request.Address))
        {
            return Task.FromResult(new SingleOrderResponse
            {
                Success = false,
                Message = "Customer Name, Phone, and Delivery Address are required."
            });
        }

        if (request.Items == null || request.Items.Count == 0)
        {
            return Task.FromResult(new SingleOrderResponse
            {
                Success = false,
                Message = "Order must contain at least one delicious dish."
            });
        }

        var storeSettings = _store.Read(db => db.Settings ?? new StoreSettings());
        var rawMethod = string.IsNullOrWhiteSpace(request.PaymentMethod) ? "card" : request.PaymentMethod.Trim().ToLowerInvariant();
        var isCod = rawMethod.Contains("cod") || rawMethod.Contains("cash");
        var paymentStatus = request.PaymentStatus ?? (isCod ? "PENDING_COD" : "PAID");

        var discountedSubtotal = Math.Max(0, request.Subtotal - request.Discount);
        var deliveryFee = request.DeliveryFee ?? (storeSettings.IsFreeDeliveryEnabled && discountedSubtotal >= storeSettings.FreeDeliveryThreshold ? 0 : storeSettings.StandardDeliveryFee);
        var taxRate = storeSettings.IsGstEnabled ? (storeSettings.GstPercent / 100.0) : 0.05;
        var tax = request.Tax ?? Math.Round(discountedSubtotal * taxRate, 2);
        var total = request.Total ?? Math.Round(discountedSubtotal + deliveryFee + tax, 2);

        var randomCode = new Random().Next(10000, 99999);
        var orderId = $"FE-{randomCode}";
        var now = DateTime.UtcNow.ToString("o");

        var txnRef = !string.IsNullOrWhiteSpace(request.UtrNumber)
            ? $"UTR-{request.UtrNumber.Trim()}"
            : (!string.IsNullOrWhiteSpace(request.TransactionRef)
                ? request.TransactionRef.Trim()
                : (isCod ? $"COD-COLLECT-{orderId.Substring(Math.Max(0, orderId.Length - 5))}" : $"UPI-SCAN-{orderId.Substring(Math.Max(0, orderId.Length - 5))}"));

        var timelineNote = isCod
            ? "Order placed via Cash on Delivery. Payment pending upon delivery."
            : (!string.IsNullOrWhiteSpace(request.UtrNumber)
                ? $"⚡ UPI QR Scanned Payment submitted with UTR: {request.UtrNumber.Trim()}."
                : "Order confirmed & payment verified via Instant Gateway.");

        var newOrder = new Order
        {
            Id = orderId,
            CustomerName = request.CustomerName.Trim(),
            Email = request.Email?.Trim() ?? string.Empty,
            Phone = request.Phone.Trim(),
            Address = request.Address.Trim(),
            AptSuite = request.AptSuite?.Trim(),
            Notes = request.Notes?.Trim(),
            PaymentMethod = rawMethod,
            PaymentStatus = paymentStatus,
            TransactionRef = txnRef,
            UtrNumber = request.UtrNumber?.Trim(),
            UpiAppUsed = request.UpiAppUsed?.Trim(),
            Items = request.Items,
            Subtotal = request.Subtotal,
            Discount = request.Discount,
            PromoCode = request.PromoCode,
            DeliveryFee = deliveryFee,
            Tax = tax,
            Total = total,
            Status = "ORDER_RECEIVED",
            StatusHistory = new List<StatusHistoryItem>
            {
                new StatusHistoryItem
                {
                    Status = "ORDER_RECEIVED",
                    Timestamp = now,
                    Note = timelineNote
                }
            },
            EtaMinutes = 22,
            CreatedAt = now,
            CourierLocation = new CourierLocation
            {
                Lat = 28.6139,
                Lng = 77.2090,
                Name = "Rameshwar Sharma (Desi Electric Thermal Pod #09)",
                Vehicle = "Electric Thermal Bike #09 (Connaught Place Hub)"
            }
        };

        _store.Update(db =>
        {
            if (db.Orders == null) db.Orders = new List<Order>();
            db.Orders.Insert(0, newOrder);

            if (db.ReceiptArchive == null) db.ReceiptArchive = new List<PaymentTransaction>();
            var itemsSummary = string.Join(", ", newOrder.Items.Select(i => $"{i.Quantity}x {i.Name}"));
            db.ReceiptArchive.Insert(0, new PaymentTransaction
            {
                Id = $"TXN-{orderId.Replace("-", "")}",
                OrderId = orderId,
                CustomerName = newOrder.CustomerName,
                Phone = newOrder.Phone,
                PaymentMethod = newOrder.PaymentMethod,
                Subtotal = newOrder.Subtotal,
                TaxAmount = newOrder.Tax,
                DiscountAmount = newOrder.Discount,
                DeliveryFee = newOrder.DeliveryFee,
                TotalAmount = newOrder.Total,
                PaymentStatus = paymentStatus,
                TransactionRef = txnRef,
                UtrNumber = newOrder.UtrNumber,
                UpiAppUsed = newOrder.UpiAppUsed,
                ItemsSummary = itemsSummary,
                CreatedAt = now,
                PaidAt = paymentStatus == "PAID" ? now : null
            });
        });

        return Task.FromResult(new SingleOrderResponse
        {
            Success = true,
            Message = "Order placed successfully! 🍽️",
            OrderId = newOrder.Id,
            Order = newOrder
        });
    }

    public Task<SingleOrderResponse> UpdateOrderStatusAsync(string id, UpdateOrderStatusRequest request)
    {
        var now = DateTime.UtcNow.ToString("o");
        var updated = _store.Update(db =>
        {
            var order = (db.Orders ?? new List<Order>()).FirstOrDefault(o => o.Id.Equals(id, StringComparison.OrdinalIgnoreCase));
            if (order == null) return null;

            if (!string.IsNullOrWhiteSpace(request.Status))
            {
                order.Status = request.Status;
                order.StatusHistory.Add(new StatusHistoryItem
                {
                    Status = request.Status,
                    Timestamp = now,
                    Note = request.Note ?? $"Status updated to {request.Status}"
                });

                var isCod = order.PaymentMethod.Contains("cod", StringComparison.OrdinalIgnoreCase) || order.PaymentMethod.Contains("cash", StringComparison.OrdinalIgnoreCase);
                if (request.Status.Equals("DELIVERED", StringComparison.OrdinalIgnoreCase) && isCod)
                {
                    order.PaymentStatus = "PAID";
                    var txn = db.ReceiptArchive?.FirstOrDefault(t => t.OrderId.Equals(id, StringComparison.OrdinalIgnoreCase));
                    if (txn != null)
                    {
                        txn.PaymentStatus = "PAID";
                        txn.PaidAt = now;
                    }
                }
            }

            return order;
        });

        if (updated == null)
        {
            return Task.FromResult(new SingleOrderResponse { Success = false, Message = "Order not found." });
        }

        return Task.FromResult(new SingleOrderResponse
        {
            Success = true,
            Message = $"Status updated to {request.Status}",
            Order = updated
        });
    }

    public Task<SingleOrderResponse> UpdateOrderAsync(string id, Order updates)
    {
        var updated = _store.Update(db =>
        {
            if (db.Orders == null) return null;
            var idx = db.Orders.FindIndex(o => o.Id.Equals(id, StringComparison.OrdinalIgnoreCase));
            if (idx == -1) return null;

            updates.Id = db.Orders[idx].Id;
            db.Orders[idx] = updates;
            return db.Orders[idx];
        });

        if (updated == null)
        {
            return Task.FromResult(new SingleOrderResponse { Success = false, Message = "Order not found." });
        }

        return Task.FromResult(new SingleOrderResponse
        {
            Success = true,
            Message = "Order updated successfully.",
            Order = updated
        });
    }

    public Task<bool> DeleteOrderAsync(string id)
    {
        var deleted = _store.Update(db =>
        {
            if (db.Orders == null) return false;
            var initLen = db.Orders.Count;
            db.Orders.RemoveAll(o => o.Id.Equals(id, StringComparison.OrdinalIgnoreCase));
            return db.Orders.Count < initLen;
        });

        return Task.FromResult(deleted);
    }
}
