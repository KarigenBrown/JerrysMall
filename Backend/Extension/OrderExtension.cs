using Backend.Domain.Entity.OrderAggregate;
using Backend.Domain.VO;
using Microsoft.EntityFrameworkCore;

namespace Backend.Extension;

public static class OrderExtension
{
    public static IQueryable<OrderVo> ProjectOrderToOrderVo(this IQueryable<Order> query)
    {
        return query
            .Select(order => new OrderVo
            {
                Id = order.Id,
                BuyerId = order.BuyerId,
                OrderData = order.OrderData,
                ShippingAddress = order.ShippingAddress,
                DeliveryFee = order.DeliveryFee,
                Subtotal = order.Subtotal,
                OrderStatus = order.OrderStatus.ToString(),
                Total = order.GetTotal(),
                OrderItems = order.OrderItems.Select(item => new OrderItemVo
                {
                    ProductId = item.ItemOrdered.ProductId,
                    Name = item.ItemOrdered.Name,
                    PictureUrl = item.ItemOrdered.PictureUrl,
                    Price = item.Price,
                    Quantity = item.Quantity
                }).ToList()
            }).AsNoTracking();
    }
}