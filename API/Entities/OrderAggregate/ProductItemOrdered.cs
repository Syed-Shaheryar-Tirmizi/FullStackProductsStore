using Microsoft.EntityFrameworkCore;

namespace API.Entities.OrderAggregate
{
    [Owned]
    public class ProductItemOrdered
    {
        public string Name { get; set; }
        public int Id { get; set; }
        public string PictureUrl { get; set; }
    }
}