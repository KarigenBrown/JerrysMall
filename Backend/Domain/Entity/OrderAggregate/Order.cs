using System.ComponentModel.DataAnnotations;

namespace Backend.Domain.Entity.OrderAggregate;

public class Order
{
    public int Id { get; set; }
    public string BuyerId { get; set; }
    [Required]
    public ShippingAddress ShippingAddress { get; set; }
    public DateTime OrderData { get; set; } = DateTime.Now;
    public List<OrderItem> OrderItems { get; set; }
    public long Subtotal { get; set; }
    public long DeliveryFee { get; set; }
    public OrderStatus OrderStatus { get; set; } = OrderStatus.Pending;

    public long GetTotal() => Subtotal + DeliveryFee;
}