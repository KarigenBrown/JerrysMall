using System.ComponentModel.DataAnnotations;
using Backend.Domain.Entity.OrderAggregate;

namespace Backend.Domain.VO;

public class OrderVo
{
    public int Id { get; set; }
    public string BuyerId { get; set; }
    [Required]
    public ShippingAddress ShippingAddress { get; set; }
    public DateTime OrderData { get; set; }
    public List<OrderItemVo> OrderItems { get; set; }
    public long Subtotal { get; set; }
    public long DeliveryFee { get; set; }
    public string OrderStatus { get; set; }
    public long Total { get; set; }
}