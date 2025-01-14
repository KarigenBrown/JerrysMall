using Backend.Data;
using Backend.Domains.Entities;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Route("/api/[controller]")]
public class ProductsController(StoreContext context) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<Product>>> GetProducts()
    {
        return await context.Products.ToListAsync();
    }

    [HttpGet("/{id}")]
    public async Task<ActionResult<Product>> GetProduct(int id)
    {
        return await context.Products.FindAsync(id) ?? throw new InvalidOperationException();
    }
}