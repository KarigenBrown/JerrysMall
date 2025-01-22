namespace Backend.Domain.Vo;

public class BasketVo
{
    public int Id { get; set; }
    public string BuyerId { get; set; }
    public List<BasketItemVo> Items { get; set; }
}