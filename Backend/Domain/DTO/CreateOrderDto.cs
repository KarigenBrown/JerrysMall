using Backend.Domain.Entity.OrderAggregate;

namespace Backend.Domain.DTO;

public class CreateOrderDto
{
    public bool SaveAddress { get; set; }
    public ShippingAddress ShippingAddress { get; set; }
}