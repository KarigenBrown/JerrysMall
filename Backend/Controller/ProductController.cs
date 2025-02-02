using Backend.Config.Db;
using Backend.Domain.Entity;
using Backend.Extension;
using Backend.Request;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controller;

public class ProductController(StoreContext context) : BackendController
{
    [HttpGet("list")]
    public async Task<ActionResult<PagedList<Product>>> GetProducts([FromQuery] ProductParams productParams)
    {
        var query = context.Products
            .Filter(productParams.Types, productParams.Brands)
            .Search(productParams.SearchTerm)
            .Sort(productParams.OrderBy)
            .AsQueryable();

        var products = await PagedList<Product>.ToPagedList(query, productParams.PageNumber, productParams.PageSize);

        Response.AddPaginationHeader(products.MetaData);

        return products;
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Product>> GetProduct(int id)
    {
        var product = await context.Products.FindAsync(id);

        if (product is null)
        {
            return NotFound();
        }

        return product;
    }

    [HttpGet("filters")]
    public async Task<IActionResult> GetFilters()
    {
        var types = await context.Products.Select(p => p.Type).Distinct().ToListAsync();
        var brands = await context.Products.Select(p => p.Brand).Distinct().ToListAsync();

        return Ok(new { types, brands });
    }
}