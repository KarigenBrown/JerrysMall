using Backend.Config.Db;
using Backend.Domain.DTO;
using Backend.Domain.Entity;
using Backend.Domain.Entity.OrderAggregate;
using Backend.Domain.VO;
using Backend.Extension;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controller;

[Authorize]
public class OrderController(StoreContext context) : BackendController
{
    [HttpGet]
    public async Task<ActionResult<List<OrderVo>>> GetOrders()
    {
        return await context.Orders
            .ProjectOrderToOrderVo()
            .Where(x => x.BuyerId == User.Identity.Name)
            .ToListAsync();
    }

    [HttpGet("{id:int}", Name = "GetOrder")]
    public async Task<ActionResult<OrderVo>> GetOrder(int id)
    {
        return await context.Orders
            .ProjectOrderToOrderVo()
            .Where(x => x.BuyerId == User.Identity.Name && x.Id == id)
            .FirstOrDefaultAsync();
    }

    [HttpPost]
    public async Task<ActionResult<int>> CreateOrder(CreateOrderDto orderDto)
    {
        var basket = await context.Baskets
            .RetrieveBasketWithItems(User.Identity.Name)
            .FirstOrDefaultAsync();

        if (basket is null)
        {
            return BadRequest(new ProblemDetails
            {
                Title = "Could not locate basket"
            });
        }

        List<OrderItem> items = [];

        foreach (var item in basket.Items)
        {
            var productItem = await context.Products.FindAsync(item.ProductId);
            var itemOrdered = new ProductItemOrdered
            {
                ProductId = productItem.Id,
                Name = productItem.Name,
                PictureUrl = productItem.PictureUrl
            };
            var orderItem = new OrderItem
            {
                ItemOrdered = itemOrdered,
                Price = productItem.Price,
                Quantity = item.Quantity
            };
            items.Add(orderItem);
            productItem.QuantityInStock -= item.Quantity;
        }

        var subtotal = items.Sum(item => item.Price * item.Quantity);
        var deliveryFee = subtotal > 10_000 ? 0 : 500;

        var order = new Order
        {
            OrderItems = items,
            BuyerId = User.Identity.Name,
            ShippingAddress = orderDto.ShippingAddress,
            Subtotal = subtotal,
            DeliveryFee = deliveryFee,
            PaymentIntentId = basket.PaymentIntentId
        };

        context.Orders.Add(order);
        context.Baskets.Remove(basket);

        if (orderDto.SaveAddress)
        {
            var user = await context.Users
                .Include(a => a.Address)
                .FirstOrDefaultAsync(x => x.UserName == User.Identity.Name);
            user.Address = new UserAddress
            {
                FullName = orderDto.ShippingAddress.FullName,
                Address1 = orderDto.ShippingAddress.Address1,
                Address2 = orderDto.ShippingAddress.Address2,
                City = orderDto.ShippingAddress.City,
                State = orderDto.ShippingAddress.State,
                Zip = orderDto.ShippingAddress.Zip,
                Country = orderDto.ShippingAddress.Country
            };
        }

        var result = await context.SaveChangesAsync() > 0;


        return result
            ? CreatedAtRoute("GetOrder", new { id = order.Id }, order.Id)
            : BadRequest("Problem creating order");
    }
}