using API.DTOs;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions
{
    public static class BasketExtemsion
    {
        public static BasketDto MapBasketEntityToDto(this Basket basket)
        {
            return new BasketDto
            {
                Id = basket.Id,
                BuyerId = basket.BuyerId,
                Items = basket.Items.Select(x => new BasketItemDto
                {
                    ProductId = x.ProductId,
                    ProductName = x.Product.Name,
                    PictureUrl = x.Product.PictureUrl,
                    Price = x.Product.Price,
                    Quantity = x.Quantity,
                    Type = x.Product.Type,
                    Brand = x.Product.Brand
                }).ToList()
            };
        }

        public static IQueryable<Basket> RetrieveBasketWithItems(this IQueryable<Basket> query, string buyerId)
        {
            return query
                .Include(x => x.Items)
                .ThenInclude(x => x.Product)
                .Where(x => x.BuyerId == buyerId);
        }
    }
}