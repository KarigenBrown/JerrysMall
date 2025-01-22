using Backend.Domain.Entity;
using Microsoft.EntityFrameworkCore;

namespace Backend.Config.Db;

public class StoreContext(DbContextOptions options) : DbContext(options)
{
    public DbSet<Product> Products { get; set; }
    public DbSet<Basket> Baskets { get; set; }
}