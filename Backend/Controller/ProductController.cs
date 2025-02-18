using AutoMapper;
using Backend.Config.Db;
using Backend.Domain.DTO;
using Backend.Domain.Entity;
using Backend.Extension;
using Backend.Request;
using Backend.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controller;

public class ProductController(StoreContext context, IMapper mapper, ImageService imageService) : BackendController
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
    public async Task<ActionResult<Product>> CreateProduct([FromForm] CreateProductDto productDto)
    {
        var product = mapper.Map<Product>(productDto);

        if (productDto.File is not null)
        {
            var imageResult = await imageService.AddImageAsync(productDto.File);

            if (imageResult.Error is not null)
            {
                return BadRequest(new ProblemDetails
                {
                    Title = imageResult.Error.Message
                });
            }

            product.PictureUrl = imageResult.SecureUrl.ToString();
            product.PublicId = imageResult.PublicId;
        }

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
    public async Task<ActionResult<Product>> UpdateProduct([FromForm] UpdateProductDto productDto)
    {
        var product = await context.Products.FindAsync(productDto.Id);

        if (product is null)
        {
            return NotFound();
        }

        mapper.Map(productDto, product);

        if (productDto.File is not null)
        {
            var imageResult = await imageService.AddImageAsync(productDto.File);

            if (imageResult.Error is not null)
            {
                return BadRequest(new ProblemDetails
                {
                    Title = imageResult.Error.Message
                });
            }

            if (!string.IsNullOrWhiteSpace(product.PublicId))
            {
                await imageService.DeleteImageAsync(product.PublicId);
            }

            product.PictureUrl = imageResult.SecureUrl.ToString();
            product.PublicId = imageResult.PublicId;
        }

        var result = await context.SaveChangesAsync() > 0;

        if (result)
        {
            return Ok(product);
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

        if (!string.IsNullOrWhiteSpace(product.PublicId))
        {
            await imageService.DeleteImageAsync(product.PublicId);
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