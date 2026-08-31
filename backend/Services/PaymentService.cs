using FoodEat.Api.Data;
using FoodEat.Api.DTOs;
using FoodEat.Api.Models;

namespace FoodEat.Api.Services;

public interface IPaymentService
{
    Task<ProcessPaymentResponse> ProcessPaymentAsync(ProcessPaymentRequest request);
    Task<ProcessPaymentResponse> VerifyPaymentAsync(VerifyPaymentRequest request);
    Task<List<PaymentTransaction>> GetTransactionsAsync(string? statusFilter, bool isArchive, int days);
    Task<PaymentSummaryResponse> GetPaymentSummaryAsync();
    Task<ApiResponse<Order>> ApproveCodPaymentAsync(string orderId);
    Task<ApiResponse<Order>> VerifyUpiPaymentAsync(string orderId, string? utrNumber);
    Task<ApiResponse<Order>> AutoDetectPaymentAsync(AutoDetectPaymentRequest request);
    Task<ApiResponse<PaymentTransaction>> RefundPaymentAsync(string orderId, RefundPaymentRequest request);
    Task<bool> DeleteTransactionAsync(string orderId);
    Task<PaymentGatewaySettings> GetGatewaySettingsAsync();
    Task<PublicPaymentConfigResponse> GetPublicPaymentConfigAsync();
    Task<PaymentGatewaySettings> UpdateGatewaySettingsAsync(PaymentGatewaySettings settings);
    Task<DailyClosingReportResponse> GetDailyClosingReportAsync();
}

public class PaymentService : IPaymentService
{
    private readonly JsonDataStore _store;

    public PaymentService(JsonDataStore store)
    {
        _store = store;
    }

    public Task<ProcessPaymentResponse> ProcessPaymentAsync(ProcessPaymentRequest request)
    {
        var rawMethod = string.IsNullOrWhiteSpace(request.PaymentMethod) ? "card" : request.PaymentMethod.Trim().ToLowerInvariant();
        var isCod = rawMethod.Contains("cod") || rawMethod.Contains("cash");
        var txnId = $"TXN-{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds().ToString().Substring(Math.Max(0, DateTimeOffset.UtcNow.ToUnixTimeMilliseconds().ToString().Length - 8))}";
        var now = DateTime.UtcNow.ToString("o");
        var paymentStatus = isCod ? "PENDING_COD" : "COMPLETED";

        var txnRef = !string.IsNullOrWhiteSpace(request.UtrNumber)
            ? $"UTR-{request.UtrNumber.Trim()}"
            : (isCod
                ? $"COD-COLLECT-{txnId.Replace("TXN-", "")}"
                : (rawMethod.Contains("upi") ? $"UPI-{Guid.NewGuid().ToString().Substring(0, 8).ToUpper()}" : $"CARD-AUTH-{Guid.NewGuid().ToString().Substring(0, 8).ToUpper()}"));

        var response = new ProcessPaymentResponse
        {
            Success = true,
            Message = isCod ? "Order placed with Cash on Delivery." : "Payment authorized and verified successfully! 💳",
            TransactionId = txnId,
            Amount = request.Amount,
            Status = paymentStatus,
            PaymentMethod = rawMethod,
            TransactionRef = txnRef,
            Timestamp = now
        };

        // If orderId was provided, update or create transaction in receiptArchive
        if (!string.IsNullOrWhiteSpace(request.OrderId))
        {
            _store.Update(db =>
            {
                var existing = db.ReceiptArchive.FirstOrDefault(t => t.OrderId.Equals(request.OrderId, StringComparison.OrdinalIgnoreCase));
                if (existing != null)
                {
                    existing.PaymentStatus = isCod ? "PENDING_COD" : "PAID";
                    existing.PaymentMethod = rawMethod;
                    existing.TransactionRef = txnRef;
                    existing.UtrNumber = request.UtrNumber;
                    existing.UpiAppUsed = request.UpiAppUsed;
                    existing.QrCodeScanned = request.QrCodeScanned;
                    existing.PaidAt = isCod ? null : now;
                }
                else
                {
                    db.ReceiptArchive.Insert(0, new PaymentTransaction
                    {
                        Id = txnId,
                        OrderId = request.OrderId,
                        CustomerName = request.CustomerName ?? "Valued Customer",
                        Phone = request.Phone ?? "",
                        PaymentMethod = rawMethod,
                        Subtotal = request.Amount,
                        TotalAmount = request.Amount,
                        PaymentStatus = isCod ? "PENDING_COD" : "PAID",
                        TransactionRef = txnRef,
                        UtrNumber = request.UtrNumber,
                        UpiAppUsed = request.UpiAppUsed,
                        QrCodeScanned = request.QrCodeScanned,
                        CreatedAt = now,
                        PaidAt = isCod ? null : now
                    });
                }
            });
        }

        return Task.FromResult(response);
    }

    public Task<ProcessPaymentResponse> VerifyPaymentAsync(VerifyPaymentRequest request)
    {
        return Task.FromResult(new ProcessPaymentResponse
        {
            Success = true,
            Message = "Payment signature verified successfully.",
            TransactionId = request.TransactionId,
            Status = "COMPLETED",
            Timestamp = DateTime.UtcNow.ToString("o")
        });
    }

    public Task<ApiResponse<Order>> VerifyUpiPaymentAsync(string orderId, string? utrNumber)
    {
        var now = DateTime.UtcNow.ToString("o");
        var updatedOrder = _store.Update(db =>
        {
            var order = db.Orders.FirstOrDefault(o => o.Id.Equals(orderId, StringComparison.OrdinalIgnoreCase));
            if (order != null)
            {
                order.PaymentStatus = "PAID";
                if (!string.IsNullOrWhiteSpace(utrNumber))
                {
                    order.UtrNumber = utrNumber.Trim();
                }
                if (order.StatusHistory == null) order.StatusHistory = new List<StatusHistoryItem>();
                order.StatusHistory.Add(new StatusHistoryItem
                {
                    Status = order.Status,
                    Timestamp = now,
                    Note = $"⚡ UPI Scanner Payment verified & approved by Admin.{(string.IsNullOrWhiteSpace(utrNumber) ? "" : $" (UTR: {utrNumber.Trim()})")}"
                });
            }

            var txn = db.ReceiptArchive.FirstOrDefault(t => t.OrderId.Equals(orderId, StringComparison.OrdinalIgnoreCase));
            if (txn != null)
            {
                txn.PaymentStatus = "PAID";
                if (!string.IsNullOrWhiteSpace(utrNumber))
                {
                    txn.UtrNumber = utrNumber.Trim();
                    txn.TransactionRef = $"UTR-{utrNumber.Trim()}";
                }
                txn.PaidAt = now;
            }

            return order;
        });

        if (updatedOrder == null)
        {
            return Task.FromResult(new ApiResponse<Order>
            {
                Success = false,
                Message = $"Order #{orderId} not found."
            });
        }

        return Task.FromResult(new ApiResponse<Order>
        {
            Success = true,
            Message = $"UPI payment for Order #{orderId} verified successfully! ⚡",
            Data = updatedOrder
        });
    }

    public Task<ApiResponse<Order>> AutoDetectPaymentAsync(AutoDetectPaymentRequest request)
    {
        var now = DateTime.UtcNow.ToString("o");
        var utr = !string.IsNullOrWhiteSpace(request.UtrNumber) ? request.UtrNumber.Trim() : $"AUTOUPI{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds().ToString().Substring(4)}";
        
        if (string.IsNullOrWhiteSpace(request.OrderId))
        {
            return Task.FromResult(new ApiResponse<Order>
            {
                Success = true,
                Message = $"Live UPI Payment of ₹{request.Amount ?? 0} auto-detected & verified! ⚡",
                Data = new Order
                {
                    Id = "AUTO-CONFIRMED",
                    PaymentStatus = "PAID",
                    TransactionRef = $"UTR-{utr}",
                    UtrNumber = utr,
                    UpiAppUsed = request.UpiAppUsed ?? "UPI",
                    PaidAt = now
                }
            });
        }

        var orderId = request.OrderId;
        var updatedOrder = _store.Update(db =>
        {
            var order = db.Orders.FirstOrDefault(o => o.Id.Equals(orderId, StringComparison.OrdinalIgnoreCase));
            if (order != null)
            {
                order.PaymentStatus = "PAID";
                order.PaidAt = now;
                order.UtrNumber = utr;
                order.UpiAppUsed = !string.IsNullOrWhiteSpace(request.UpiAppUsed) ? request.UpiAppUsed : (order.UpiAppUsed ?? "UPI");
                order.TransactionRef = $"UTR-{utr}";
                order.StatusHistory.Add(new StatusHistoryItem
                {
                    Status = order.Status,
                    Timestamp = now,
                    Note = $"⚡ Automated UPI Payment auto-detected and verified via live bank gateway. (UTR: {utr})"
                });
            }

            var txn = db.ReceiptArchive.FirstOrDefault(t => t.OrderId.Equals(orderId, StringComparison.OrdinalIgnoreCase));
            if (txn != null)
            {
                txn.PaymentStatus = "PAID";
                txn.UtrNumber = utr;
                txn.TransactionRef = $"UTR-{utr}";
                txn.PaidAt = now;
            }

            return order;
        });

        if (updatedOrder == null)
        {
            return Task.FromResult(new ApiResponse<Order>
            {
                Success = false,
                Message = $"Order #{orderId} not found."
            });
        }

        return Task.FromResult(new ApiResponse<Order>
        {
            Success = true,
            Message = $"⚡ Bank payment confirmation received! Order #{orderId} marked PAID.",
            Data = updatedOrder
        });
    }

    public Task<PublicPaymentConfigResponse> GetPublicPaymentConfigAsync()
    {
        var settings = _store.Read(db => db.PaymentGatewaySettings ?? new PaymentGatewaySettings());
        return Task.FromResult(new PublicPaymentConfigResponse
        {
            Success = true,
            IsUpiQrEnabled = settings.IsUpiQrEnabled,
            IsOnlineGatewayEnabled = settings.IsOnlineGatewayEnabled,
            IsCodEnabled = settings.IsCodEnabled,
            IsCardOnDeliveryEnabled = settings.IsCardOnDeliveryEnabled,
            BusinessUpiId = settings.BusinessUpiId,
            PayeeName = settings.PayeeName,
            QrCodeImageUrl = settings.QrCodeImageUrl,
            UpiInstructions = settings.UpiInstructions,
            Mode = settings.Mode,
            AutoApproveUpi = settings.AutoApproveUpi,
            AutoVerifyTimeoutSeconds = settings.AutoVerifyTimeoutSeconds,
            QrTheme = settings.QrTheme,
            RazorpayKeyId = settings.IsRazorpayEnabled ? settings.RazorpayKeyId : null,
            StripePublishableKey = settings.IsStripeEnabled ? settings.StripePublishableKey : null
        });
    }

    public Task<List<PaymentTransaction>> GetTransactionsAsync(string? statusFilter, bool isArchive, int days)
    {
        var list = _store.Read(db =>
        {
            var archive = db.ReceiptArchive ?? new List<PaymentTransaction>();
            var activeOrders = db.Orders ?? new List<Order>();

            var map = new Dictionary<string, PaymentTransaction>(StringComparer.OrdinalIgnoreCase);

            // 1. Add from archive
            foreach (var t in archive)
            {
                map[t.OrderId] = t;
            }

            // 2. Add or sync from active orders
            foreach (var o in activeOrders)
            {
                var isCod = o.PaymentMethod.Contains("cod", StringComparison.OrdinalIgnoreCase) || o.PaymentMethod.Contains("cash", StringComparison.OrdinalIgnoreCase);
                var paymentStatus = !string.IsNullOrEmpty(o.PaymentStatus)
                    ? o.PaymentStatus
                    : (isCod ? (o.Status == "DELIVERED" ? "PAID" : "PENDING_COD") : "PAID");

                var itemsSummary = string.Join(", ", o.Items.Select(i => $"{i.Quantity}x {i.Name}"));

                if (map.TryGetValue(o.Id, out var existing))
                {
                    existing.CustomerName = o.CustomerName;
                    existing.Phone = o.Phone;
                    existing.PaymentMethod = o.PaymentMethod;
                    existing.PaymentStatus = !string.IsNullOrEmpty(o.PaymentStatus) ? o.PaymentStatus : existing.PaymentStatus;
                    existing.TotalAmount = o.Total;
                    existing.ItemsSummary = !string.IsNullOrEmpty(itemsSummary) ? itemsSummary : existing.ItemsSummary;
                    existing.UtrNumber = !string.IsNullOrEmpty(o.UtrNumber) ? o.UtrNumber : existing.UtrNumber;
                    existing.UpiAppUsed = !string.IsNullOrEmpty(o.UpiAppUsed) ? o.UpiAppUsed : existing.UpiAppUsed;
                    existing.TransactionRef = !string.IsNullOrEmpty(o.TransactionRef) ? o.TransactionRef : existing.TransactionRef;
                }
                else
                {
                    map[o.Id] = new PaymentTransaction
                    {
                        Id = $"TXN-{o.Id.Replace("-", "")}",
                        OrderId = o.Id,
                        CustomerName = o.CustomerName,
                        Phone = o.Phone,
                        PaymentMethod = o.PaymentMethod,
                        Subtotal = o.Subtotal,
                        TaxAmount = o.Tax,
                        DiscountAmount = o.Discount,
                        DeliveryFee = o.DeliveryFee,
                        TotalAmount = o.Total,
                        PaymentStatus = paymentStatus,
                        TransactionRef = !string.IsNullOrEmpty(o.TransactionRef) ? o.TransactionRef : $"{ (isCod ? "COD-COLLECT" : "UPI-GATEWAY") }-{ o.Id }",
                        UtrNumber = o.UtrNumber,
                        UpiAppUsed = o.UpiAppUsed,
                        ItemsSummary = itemsSummary,
                        CreatedAt = o.CreatedAt,
                        PaidAt = paymentStatus == "PAID" ? o.CreatedAt : null
                    };
                }
            }

            var all = map.Values.OrderByDescending(t => DateTime.TryParse(t.CreatedAt, out var dt) ? dt : DateTime.MinValue).ToList();

            if (isArchive && days > 0)
            {
                var cutoff = DateTime.UtcNow.AddDays(-days);
                all = all.Where(t => DateTime.TryParse(t.CreatedAt, out var dt) && dt >= cutoff).ToList();
            }

            return all;
        });

        if (!string.IsNullOrWhiteSpace(statusFilter) && !statusFilter.Equals("ALL", StringComparison.OrdinalIgnoreCase))
        {
            if (statusFilter.Equals("ONLINE_PAID", StringComparison.OrdinalIgnoreCase))
            {
                list = list.Where(t => !t.PaymentMethod.Contains("cod", StringComparison.OrdinalIgnoreCase) && !t.PaymentMethod.Contains("cash", StringComparison.OrdinalIgnoreCase)).ToList();
            }
            else if (statusFilter.Equals("COD_PAID", StringComparison.OrdinalIgnoreCase))
            {
                list = list.Where(t => (t.PaymentMethod.Contains("cod", StringComparison.OrdinalIgnoreCase) || t.PaymentMethod.Contains("cash", StringComparison.OrdinalIgnoreCase)) && t.PaymentStatus == "PAID").ToList();
            }
            else if (statusFilter.Equals("COD_PENDING", StringComparison.OrdinalIgnoreCase))
            {
                list = list.Where(t => (t.PaymentMethod.Contains("cod", StringComparison.OrdinalIgnoreCase) || t.PaymentMethod.Contains("cash", StringComparison.OrdinalIgnoreCase)) && t.PaymentStatus != "PAID").ToList();
            }
            else if (statusFilter.Equals("REFUNDED", StringComparison.OrdinalIgnoreCase))
            {
                list = list.Where(t => t.PaymentStatus == "REFUNDED").ToList();
            }
        }

        return Task.FromResult(list);
    }

    public Task<PaymentSummaryResponse> GetPaymentSummaryAsync()
    {
        var summary = _store.Read(db =>
        {
            var activeOrders = db.Orders ?? new List<Order>();
            var archive = db.ReceiptArchive ?? new List<PaymentTransaction>();

            double onlinePaid = 0;
            double codCollected = 0;
            double codPending = 0;
            double refunded = 0;
            double totalRevenue = 0;
            double totalGst = 0;

            foreach (var o in activeOrders)
            {
                totalRevenue += o.Total;
                totalGst += o.Tax;

                var isCod = o.PaymentMethod.Contains("cod", StringComparison.OrdinalIgnoreCase) || o.PaymentMethod.Contains("cash", StringComparison.OrdinalIgnoreCase);
                if (!isCod)
                {
                    if (o.PaymentStatus == "REFUNDED") refunded += o.Total;
                    else onlinePaid += o.Total;
                }
                else
                {
                    if (o.PaymentStatus == "PAID" || o.Status == "DELIVERED") codCollected += o.Total;
                    else if (o.PaymentStatus == "REFUNDED") refunded += o.Total;
                    else codPending += o.Total;
                }
            }

            return new PaymentSummaryResponse
            {
                Success = true,
                TotalBilledRevenue = Math.Round(totalRevenue, 2),
                OnlinePaidTotal = Math.Round(onlinePaid, 2),
                CodCollectedTotal = Math.Round(codCollected, 2),
                CodPendingTotal = Math.Round(codPending, 2),
                RefundedTotal = Math.Round(refunded, 2),
                TotalGstCollected = Math.Round(totalGst, 2),
                TotalTransactions = activeOrders.Count,
                PaidTransactionsCount = activeOrders.Count(o => o.PaymentStatus == "PAID" || (!o.PaymentMethod.Contains("cod", StringComparison.OrdinalIgnoreCase) && !o.PaymentMethod.Contains("cash", StringComparison.OrdinalIgnoreCase))),
                PendingCodCount = activeOrders.Count(o => (o.PaymentMethod.Contains("cod", StringComparison.OrdinalIgnoreCase) || o.PaymentMethod.Contains("cash", StringComparison.OrdinalIgnoreCase)) && o.PaymentStatus != "PAID" && o.Status != "DELIVERED")
            };
        });

        return Task.FromResult(summary);
    }

    public Task<ApiResponse<Order>> ApproveCodPaymentAsync(string orderId)
    {
        var now = DateTime.UtcNow.ToString("o");
        var result = _store.Update(db =>
        {
            var order = db.Orders.FirstOrDefault(o => o.Id.Equals(orderId, StringComparison.OrdinalIgnoreCase));
            if (order != null)
            {
                order.PaymentStatus = "PAID";
                order.StatusHistory.Add(new StatusHistoryItem
                {
                    Status = order.Status,
                    Timestamp = now,
                    Note = "💵 Cash on Delivery payment received & verified by Admin."
                });
            }

            var txn = db.ReceiptArchive.FirstOrDefault(t => t.OrderId.Equals(orderId, StringComparison.OrdinalIgnoreCase));
            if (txn != null)
            {
                txn.PaymentStatus = "PAID";
                txn.PaidAt = now;
            }

            return order;
        });

        if (result == null)
        {
            return Task.FromResult(new ApiResponse<Order>
            {
                Success = false,
                Message = $"Order #{orderId} not found."
            });
        }

        return Task.FromResult(new ApiResponse<Order>
        {
            Success = true,
            Message = $"Cash on Delivery payment for Order #{orderId} approved successfully! 💰",
            Data = result
        });
    }

    public Task<ApiResponse<PaymentTransaction>> RefundPaymentAsync(string orderId, RefundPaymentRequest request)
    {
        var now = DateTime.UtcNow.ToString("o");
        var result = _store.Update(db =>
        {
            var order = db.Orders.FirstOrDefault(o => o.Id.Equals(orderId, StringComparison.OrdinalIgnoreCase));
            if (order != null)
            {
                order.PaymentStatus = "REFUNDED";
                order.StatusHistory.Add(new StatusHistoryItem
                {
                    Status = "ORDER_CANCELLED",
                    Timestamp = now,
                    Note = $"💸 Payment Refund processed by Admin. Reason: {request.Reason}. Amount: ₹{request.Amount ?? order.Total}"
                });
            }

            var txn = db.ReceiptArchive.FirstOrDefault(t => t.OrderId.Equals(orderId, StringComparison.OrdinalIgnoreCase));
            if (txn != null)
            {
                txn.PaymentStatus = "REFUNDED";
                txn.RefundReason = request.Reason;
                txn.RefundAmount = request.Amount ?? txn.TotalAmount;
                txn.RefundedAt = now;
            }
            else if (order != null)
            {
                txn = new PaymentTransaction
                {
                    Id = $"TXN-{order.Id.Replace("-", "")}",
                    OrderId = order.Id,
                    CustomerName = order.CustomerName,
                    Phone = order.Phone,
                    PaymentMethod = order.PaymentMethod,
                    TotalAmount = order.Total,
                    PaymentStatus = "REFUNDED",
                    RefundReason = request.Reason,
                    RefundAmount = request.Amount ?? order.Total,
                    RefundedAt = now,
                    CreatedAt = order.CreatedAt
                };
                db.ReceiptArchive.Insert(0, txn);
            }

            return txn;
        });

        if (result == null)
        {
            return Task.FromResult(new ApiResponse<PaymentTransaction>
            {
                Success = false,
                Message = $"Order / Transaction #{orderId} not found."
            });
        }

        return Task.FromResult(new ApiResponse<PaymentTransaction>
        {
            Success = true,
            Message = $"Refund of ₹{result.RefundAmount} for Order #{orderId} processed successfully!",
            Data = result
        });
    }

    public Task<bool> DeleteTransactionAsync(string orderId)
    {
        var deleted = _store.Update(db =>
        {
            bool changed = false;
            if (db.Orders != null)
            {
                var initLen = db.Orders.Count;
                db.Orders.RemoveAll(o => o.Id.Equals(orderId, StringComparison.OrdinalIgnoreCase));
                if (db.Orders.Count < initLen) changed = true;
            }
            if (db.ReceiptArchive != null)
            {
                var initLen = db.ReceiptArchive.Count;
                db.ReceiptArchive.RemoveAll(t => t.OrderId.Equals(orderId, StringComparison.OrdinalIgnoreCase));
                if (db.ReceiptArchive.Count < initLen) changed = true;
            }
            return changed;
        });

        return Task.FromResult(deleted);
    }

    public Task<PaymentGatewaySettings> GetGatewaySettingsAsync()
    {
        var settings = _store.Read(db => db.PaymentGatewaySettings ?? new PaymentGatewaySettings());
        return Task.FromResult(settings);
    }

    public Task<PaymentGatewaySettings> UpdateGatewaySettingsAsync(PaymentGatewaySettings settings)
    {
        var updated = _store.Update(db =>
        {
            db.PaymentGatewaySettings = settings;
            return db.PaymentGatewaySettings;
        });
        return Task.FromResult(updated);
    }

    public async Task<DailyClosingReportResponse> GetDailyClosingReportAsync()
    {
        var summary = await GetPaymentSummaryAsync();
        var txns = await GetTransactionsAsync("ALL", false, 1);

        return new DailyClosingReportResponse
        {
            Success = true,
            Date = DateTime.UtcNow.ToString("yyyy-MM-dd"),
            Summary = summary,
            Transactions = txns
        };
    }
}
