using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class ProductContext : DbContext
    {
        public ProductContext(DbContextOptions options) : base(options)
        {

        }

        public DbSet<Product> Products {get; set; }
        public DbSet<Basket> Baskets {get; set; }
    }
}