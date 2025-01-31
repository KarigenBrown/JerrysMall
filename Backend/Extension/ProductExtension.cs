using Backend.Domain.Entity;

namespace Backend.Extension;

public static class ProductExtension
{
    public static IQueryable<Product> Sort(this IQueryable<Product> query, string? orderBy)
    {
        if (string.IsNullOrWhiteSpace(orderBy))
        {
            return query.OrderBy(p => p.Name);
        }

        return orderBy switch
        {
            "price" => query.OrderBy(p => p.Price),
            "priceDesc" => query.OrderByDescending(p => p.Price),
            _ => query.OrderBy(p => p.Name)
        };
    }

    public static IQueryable<Product> Search(this IQueryable<Product> query, string? searchTerm)
    {
        if (string.IsNullOrWhiteSpace(searchTerm))
        {
            return query;
        }

        var lowerCaseSearchTerm = searchTerm.Trim().ToLower();

        return query.Where(p => p.Name.ToLower().Contains(lowerCaseSearchTerm));
    }

    public static IQueryable<Product> Filter(this IQueryable<Product> query, string? types, string? brands)
    {
        var typeList = new List<string>();
        var brandList = new List<string>();

        if (!string.IsNullOrWhiteSpace(types))
        {
            typeList.AddRange(types.ToLower().Split(",").ToList());
        }

        if (!string.IsNullOrWhiteSpace(brands))
        {
            brandList.AddRange(brands.ToLower().Split(",").ToList());
        }

        query = query.Where(p => typeList.Count == 0 || typeList.Contains(p.Type.ToLower()));
        query = query.Where(p => brandList.Count == 0 || brandList.Contains(p.Brand.ToLower()));

        return query;
    }
}