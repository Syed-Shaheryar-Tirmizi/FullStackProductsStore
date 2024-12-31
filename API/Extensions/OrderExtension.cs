using API.DTOs;
using API.Entities.OrderAggregate;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions
{
    public static class OrderExtension
    {
        public static IQueryable<OrderDto> ProjectOrderToOrderDto(this IQueryable<Order> query)
        {
            return query.Select(order => new OrderDto
            {
                Id = order.Id,
                BuyerId = order.BuyerId,
                OrderDate = order.OrderDate,
                ShippingAddress = order.ShippingAddress,
                DeliveryFee = order.DeliveryFee,
                SubTotal = order.SubTotal,
                Total = order.Total,
                Status = order.Status.ToString(),
                Items = order.Items.Select(orderItem => new OrderItemDto
                {
                    ProductId = orderItem.ProductItemOrdered.Id,
                    ProductName = orderItem.ProductItemOrdered.Name,
                    PictureUrl = orderItem.ProductItemOrdered.PictureUrl,
                    Price = orderItem.Price,
                    Quantity = orderItem.Quantity
                }).ToList()
            }).AsNoTracking();
        }
    }
}