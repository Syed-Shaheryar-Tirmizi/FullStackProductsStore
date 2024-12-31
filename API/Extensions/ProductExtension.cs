using API.Entities;

namespace API.Extensions
{
    public static class ProductExtension
    {
        public static IQueryable<Product> Sort(this IQueryable<Product> query, string orderBy)
        {
            query = orderBy switch
            {
                "price" => query.OrderBy(x => x.Price),
                "priceDesc" => query.OrderByDescending(x => x.Price),
                _ => query.OrderBy(x => x.Name)
            };
            return query;
        }

        public static IQueryable<Product> Search(this IQueryable<Product> query, string search)
        {
            if (string.IsNullOrEmpty(search)) return query;
            return query.Where(x => x.Name.Contains(search, StringComparison.OrdinalIgnoreCase));
        }

        public static IQueryable<Product> Filter(this IQueryable<Product> query, string types, string brands)
        {
            var typeList = types?.ToLower()?.Split(',').ToList();
            var brandList = brands?.ToLower()?.Split(',').ToList();
            return query.Where(x => (typeList == null || typeList.Contains(x.Type.ToLower())) && (brandList == null || brandList.Contains(x.Brand.ToLower())));
        }
    }
}