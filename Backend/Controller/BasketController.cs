using Backend.Config.Db;
using Backend.Domain.Vo;
using Backend.Domain.Entity;
using Backend.Extension;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controller;

public class BasketController(StoreContext context) : BackendController
{
    private const string BuyerId = "buyerId";

    [HttpGet(Name = "GetBasket")]
    public async Task<ActionResult<BasketVo>> GetBasket()
    {
        var basket = await RetrieveBasketAsync(GetBuyerId());

        if (basket is null)
        {
            return NotFound();
        }

        return basket.MapBasketToVo();
    }

    [HttpPost] // /Backend/Basket?productId=3&quantity=2
    public async Task<ActionResult<BasketVo>> AddItemToBasket(int productId, int quantity)
    {
        var basket = await RetrieveBasketAsync(GetBuyerId());
        basket ??= await CreateBasket();
        var product = await context.Products.FindAsync(productId);
        if (product is null)
        {
            return NotFound();
        }

        basket.AddItem(product, quantity);
        var result = await context.SaveChangesAsync() > 0;
        return result
            ? CreatedAtRoute("GetBasket", basket.MapBasketToVo())
            : BadRequest(new ProblemDetails
            {
                Title = "Problem saving item to basket"
            });
    }

    [HttpDelete]
    public async Task<ActionResult> RemoveBasketItem(int productId, int quantity)
    {
        var basket = await RetrieveBasketAsync(GetBuyerId());
        if (basket is null)
        {
            return BadRequest(new ProblemDetails
            {
                Title = "Product Not Found"
            });
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

    private async Task<Basket?> RetrieveBasketAsync(string? buyerId)
    {
        if (string.IsNullOrWhiteSpace(buyerId))
        {
            Response.Cookies.Delete(BuyerId);
            return null;
        }

        return await context.Baskets
            .Include(i => i.Items)
            .ThenInclude(p => p.Product)
            .FirstOrDefaultAsync(x => x.BuyerId == buyerId);
    }

    private string? GetBuyerId()
    {
        return User.Identity?.Name ?? Request.Cookies[BuyerId];
    }

    private async Task<Basket> CreateBasket()
    {
        var buyerId = User.Identity?.Name;
        if (string.IsNullOrWhiteSpace(buyerId))
        {
            buyerId = Guid.NewGuid().ToString();
            var cookieOptions = new CookieOptions
            {
                IsEssential = true,
                Expires = DateTime.Now.AddDays(30)
            };
            Response.Cookies.Append(BuyerId, buyerId, cookieOptions);
        }

        var basket = new Basket
        {
            BuyerId = buyerId
        };
        await context.AddAsync(basket);
        return basket;
    }
}