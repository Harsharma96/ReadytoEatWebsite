using Microsoft.AspNetCore.Mvc;
using FoodEat.Api.DTOs;
using FoodEat.Api.Models;
using FoodEat.Api.Services;

namespace FoodEat.Api.Controllers;

[ApiController]
[Route("api/products")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _productService;

    public ProductsController(IProductService productService)
    {
        _productService = productService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? category, [FromQuery] string? search, [FromQuery] string? diet)
    {
        var products = await _productService.GetProductsAsync(category, search, diet);
        return Ok(new ProductListResponse
        {
            Success = true,
            Count = products.Count,
            Products = products
        });
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var product = await _productService.GetProductByIdAsync(id);
        if (product == null)
        {
            return NotFound(new { success = false, message = "Product not found." });
        }
        return Ok(new { success = true, product });
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Product product)
    {
        if (string.IsNullOrWhiteSpace(product.Name) || product.Price <= 0)
        {
            return BadRequest(new { success = false, message = "Product Name and valid Price are required." });
        }

        var created = await _productService.CreateProductAsync(product);
        return StatusCode(201, new
        {
            success = true,
            message = "Dish added to Royal Menu successfully! 🍽️",
            product = created
        });
    }

    [HttpPatch("{id}")]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] Product updates)
    {
        var updated = await _productService.UpdateProductAsync(id, updates);
        if (updated == null)
        {
            return NotFound(new { success = false, message = "Product not found." });
        }
        return Ok(new
        {
            success = true,
            message = "Product updated successfully.",
            product = updated
        });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var deleted = await _productService.DeleteProductAsync(id);
        if (!deleted)
        {
            return NotFound(new { success = false, message = "Product not found." });
        }
        return Ok(new { success = true, message = "Dish removed from catalog successfully." });
    }
}
