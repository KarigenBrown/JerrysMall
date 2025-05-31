using Backend.Domain.Entity;
using Backend.Domain.Vo;
using Microsoft.EntityFrameworkCore;

namespace Backend.Extension;

// Extension要求类和方法都用statics修饰,并且第一个方法参数要用this修饰
public static class BasketExtension
{
    public static BasketVo MapBasketToVo(this Basket basket)
    {
        return new BasketVo
        {
            Id = basket.Id,
            BuyerId = basket.BuyerId,
            PaymentIntentId = basket.PaymentIntentId,
            ClientSecret = basket.ClientSecret,
            Items = basket.Items.Select(item => new BasketItemVo
            {
                ProductId = item.ProductId,
                Name = item.Product.Name,
                Price = item.Product.Price,
                PictureUrl = item.Product.PictureUrl,
                Type = item.Product.Type,
                Brand = item.Product.Brand,
                Quantity = item.Quantity
            }).ToList()
        };
    }

    public static IQueryable<Basket> RetrieveBasketWithItems(this IQueryable<Basket> query, string buyerId)
    {
        return query.Include(i => i.Items)
            .ThenInclude(p => p.Product)
            .Where(b => b.BuyerId == buyerId);
    }
}