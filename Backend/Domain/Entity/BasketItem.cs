using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Domain.Entity;

[Table("BasketItems")]
public class BasketItem
{
    public int Id { get; set; }

    public int Quantity { get; set; }

    // navigation property
    // 在entity上面的Id会默认作为外键存在
    public int ProductId { get; set; }
    public required Product Product { get; set; }
    public int BasketId { get; set; }
    public Basket Basket { get; set; } = null!;
}