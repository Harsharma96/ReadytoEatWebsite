using Microsoft.AspNetCore.Mvc;
using FoodEat.Api.DTOs;
using FoodEat.Api.Models;
using FoodEat.Api.Services;

namespace FoodEat.Api.Controllers;

[ApiController]
[Route("api/orders")]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;
    private readonly IPaymentService _paymentService;

    public OrdersController(IOrderService orderService, IPaymentService paymentService)
    {
        _orderService = orderService;
        _paymentService = paymentService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var orders = await _orderService.GetOrdersAsync();
        return Ok(new OrderListResponse
        {
            Success = true,
            Count = orders.Count,
            Orders = orders
        });
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var order = await _orderService.GetOrderByIdAsync(id);
        if (order == null)
        {
            return NotFound(new { success = false, message = "Order not found." });
        }
        return Ok(new { success = true, order });
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateOrderRequest request)
    {
        var result = await _orderService.CreateOrderAsync(request);
        if (!result.Success)
        {
            return BadRequest(result);
        }
        return StatusCode(201, result);
    }

    [HttpPatch("{id}")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateStatus(string id, [FromBody] UpdateOrderStatusRequest request)
    {
        var result = await _orderService.UpdateOrderStatusAsync(id, request);
        if (!result.Success)
        {
            return NotFound(result);
        }
        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var deleted = await _orderService.DeleteOrderAsync(id);
        if (!deleted)
        {
            return NotFound(new { success = false, message = "Order not found." });
        }
        return Ok(new { success = true, message = "Order deleted from active kitchen dispatch." });
    }

    [HttpPost("{id}/approve-cod")]
    public async Task<IActionResult> ApproveCodPayment(string id)
    {
        var result = await _paymentService.ApproveCodPaymentAsync(id);
        if (!result.Success)
        {
            return NotFound(result);
        }
        return Ok(result);
    }
}
