using Backend.Data;
using Backend.Domains.DTOs;
using Backend.Domains.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

public class BasketController(StoreContext context) : BaseBackendController
{
    private const string CookieKey = "buyerId";

    [HttpGet(Name = "GetBasket")]
    public async Task<ActionResult<BasketDto>> GetBasket()
    {
        var basket = await RetrieveBasket();

        if (basket is null)
        {
            return NotFound();
        }

        return MapBasketToDto(basket);
    }

    [HttpPost] // /Backend/Basket?productId=3&quantity=2
    public async Task<ActionResult<BasketDto>> AddItemToBasket(int productId, int quantity)
    {
        var basket = await RetrieveBasket();
        basket ??= await CreateBasket();
        var product = await context.Products.FindAsync(productId);
        if (product is null)
        {
            return NotFound();
        }

        basket.AddItem(product, quantity);
        var result = await context.SaveChangesAsync() > 0;
        return result
            ? CreatedAtRoute("GetBasket", MapBasketToDto(basket))
            : BadRequest(new ProblemDetails
            {
                Title = "Problem saving item to basket"
            });
    }

    [HttpDelete]
    public async Task<ActionResult> RemoveBasketItem(int productId, int quantity)
    {
        var basket = await RetrieveBasket();
        if (basket is null)
        {
            return NoContent();
        }

        basket.RemoveItem(productId, quantity);
        var result = await context.SaveChangesAsync() > 0;
        return result
            ? Ok()
            : BadRequest(new ProblemDetails
            {
                Title = "Problem removing item from the basket"
            });
    }

    private async Task<Basket?> RetrieveBasket()
    {
        return await context.Baskets
            .Include(i => i.Items)
            .ThenInclude(p => p.Product)
            .FirstOrDefaultAsync(x => x.BuyerId == Request.Cookies[CookieKey]);
    }

    private async Task<Basket> CreateBasket()
    {
        var buyerId = Guid.NewGuid().ToString();
        var cookieOptions = new CookieOptions
        {
            IsEssential = true,
            Expires = DateTime.Now.AddDays(30)
        };
        Response.Cookies.Append(CookieKey, buyerId, cookieOptions);
        var basket = new Basket
        {
            BuyerId = buyerId
        };
        await context.AddAsync(basket);
        return basket;
    }

    private BasketDto MapBasketToDto(Basket basket)
    {
        return new BasketDto
        {
            Id = basket.Id,
            BuyerId = basket.BuyerId,
            Items = basket.Items.Select(item => new BasketItemDto
            {
                ProductId = item.ProductId,
                Name = item.Product.Name,
                PictureUrl = item.Product.PictureUrl,
                Type = item.Product.Type,
                Brand = item.Product.Brand,
                Quantity = item.Quantity
            }).ToList()
        };
    }
}