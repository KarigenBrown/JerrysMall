using AutoMapper;
using Backend.Config.Db;
using Backend.Domain.DTO;
using Backend.Domain.Entity;
using Backend.Extension;
using Backend.Request;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controller;

public class ProductController(StoreContext context, IMapper mapper) : BackendController
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

    [HttpGet("{id:int}", Name = "GetProduct")]
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

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<Product>> CreateProduct(CreateProductDto productDto)
    {
        var product = mapper.Map<Product>(productDto);

        await context.Products.AddAsync(product);

        var result = await context.SaveChangesAsync() > 0;

        if (result)
        {
            return CreatedAtRoute("GetProduct", new { Id = product.Id }, product);
        }

        return BadRequest(new ProblemDetails
        {
            Title = "Problem creating new product"
        });
    }

    [Authorize(Roles = "Admin")]
    [HttpPut]
    public async Task<ActionResult> UpdateProduct(UpdateProductDto productDto)
    {
        var product = await context.Products.FindAsync(productDto.Id);

        if (product is null)
        {
            return NotFound();
        }

        mapper.Map(productDto, product);

        var result = await context.SaveChangesAsync() > 0;

        if (result)
        {
            return NoContent();
        }

        return BadRequest(new ProblemDetails
        {
            Title = "Problem updating product"
        });
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id:int}")]
    public async Task<ActionResult> DeleteProduct(int id)
    {
        var product = await context.Products.FindAsync(id);

        if (product is null)
        {
            return NotFound();
        }

        context.Products.Remove(product);
        
        var result = await context.SaveChangesAsync() > 0;
        
        if (result)
        {
            return Ok();
        }

        return BadRequest(new ProblemDetails
        {
            Title = "Problem deleting product"
        });
    }
}