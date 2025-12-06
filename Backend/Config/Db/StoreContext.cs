using Backend.Domain.Entity;
using Backend.Domain.Entity.OrderAggregate;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace Backend.Config.Db;

/*
 * 数据库的"网关",所有数据库操作全用DbContext完成
 *
 * DbContext不包含ASP.NET Core自带的Identity功能,要使用该功能需要IdentityDbContext
 * 第一个泛型是用户,第二个是角色,第三个是用户和角色的Id,用户和角色的Id类型需要一致
 */
public class StoreContext(DbContextOptions options) : IdentityDbContext<User, Role, int>(options)
{
    // 每个DbSet表示一张表
    public DbSet<Product> Products { get; set; }
    public DbSet<Basket> Baskets { get; set; }
    public DbSet<Order> Orders { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<User>()
            .HasOne(a => a.Address)
            .WithOne()
            .HasForeignKey<UserAddress>(a => a.Id)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<Role>()
            .HasData(
                new Role
                {
                    Id = 1,
                    Name = "Member",
                    NormalizedName = "MEMBER"
                },
                new Role
                {
                    Id = 2,
                    Name = "Admin",
                    NormalizedName = "ADMIN"
                }
            );
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        base.OnConfiguring(optionsBuilder);

        optionsBuilder.ConfigureWarnings(warnings => warnings.Ignore(RelationalEventId.PendingModelChangesWarning));
    }
}