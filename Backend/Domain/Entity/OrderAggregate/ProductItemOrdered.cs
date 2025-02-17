using Microsoft.EntityFrameworkCore;

namespace Backend.Domain.Entity.OrderAggregate;

[Owned]
public class ProductItemOrdered
{
    public int ProductId { get; set; }
    public required string Name { get; set; }
    public required string PictureUrl { get; set; }
}