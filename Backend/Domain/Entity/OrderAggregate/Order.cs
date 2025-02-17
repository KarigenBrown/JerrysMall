namespace Backend.Domain.Entity.OrderAggregate;

public class Order
{
    public int Id { get; set; }
    public required string BuyerId { get; set; }
    public required ShippingAddress ShippingAddress { get; set; }
    public DateTime OrderData { get; set; } = DateTime.UtcNow;
    public List<OrderItem> OrderItems { get; set; } = [];
    public long Subtotal { get; set; }
    public long DeliveryFee { get; set; }
    public OrderStatus OrderStatus { get; set; } = OrderStatus.Pending;
    public required string PaymentIntentId { get; set; }

    public long GetTotal() => Subtotal + DeliveryFee;
}