namespace Backend.Domain.Entity;

public class Product
{
    // Id默认为表的自增主键
    public int Id { get; set; }
    // required为编译时检测,必须初始化
    public required string Name { get; set; }
    public required string Description { get; set; }
    public long Price { get; set; }
    public required string PictureUrl { get; set; }
    public required string Type { get; set; }
    public required string Brand { get; set; }
    public int QuantityInStock { get; set; }
    public string? PublicId { get; set; }
}