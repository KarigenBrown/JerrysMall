using Backend.Domain.Entity;
using Backend.Domain.Vo;

namespace Backend.Extension;

public static class BasketExtension
{
    public static BasketVo MapBasketToVo(this Basket basket)
    {
        return new BasketVo
        {
            Id = basket.Id,
            BuyerId = basket.BuyerId,
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
}