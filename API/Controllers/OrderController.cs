using API.Data;
using API.DTOs;
using API.Entities;
using API.Entities.OrderAggregate;
using API.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize]
    public class OrderController : BaseApiController
    {
        private readonly ProductContext _context;

        public OrderController(ProductContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<OrderDto>>> GetOrders()
        {
            return await _context.Order
                .ProjectOrderToOrderDto()
                .Where(user => user.BuyerId == User.Identity.Name)
                .ToListAsync();
        }

        [HttpGet("{id}", Name = "GetOrder")]
        public async Task<ActionResult<OrderDto>> GetOrder(int id)
        {
            return await _context.Order
                .ProjectOrderToOrderDto()
                .Where(user => user.BuyerId == User.Identity.Name)
                .FirstOrDefaultAsync(o => o.Id == id);
        }

        [HttpPost]
        public async Task<ActionResult<int>> CreateOrder(CreateOrderDto orderDto)
        {
            var basket = await _context.Baskets
                .RetrieveBasketWithItems(User.Identity.Name)
                .FirstOrDefaultAsync();

            if (basket is null) return BadRequest(new ProblemDetails { Title = "Basket is empty" });

            var items = new List<OrderItem>();

            foreach (var item in basket.Items)
            {
                var productItem = await _context.Products.FindAsync(item.ProductId);

                var itemOrdered = new ProductItemOrdered
                {
                    Id = productItem.Id,
                    Name = productItem.Name,
                    PictureUrl = productItem.PictureUrl
                };

                var orderItem = new OrderItem
                {
                    ProductItemOrdered = itemOrdered,
                    Price = productItem.Price,
                    Quantity = item.Quantity
                };

                items.Add(orderItem);
                productItem.QuantityInStock -= item.Quantity;
            }

            var subtotal = items.Sum(item => item.Price * item.Quantity);
            var deliveryFee = subtotal > 10000 ? 0 : 500;

            var order = new Order
            {
                BuyerId = User.Identity.Name,
                ShippingAddress = orderDto.ShippingAddress,
                DeliveryFee = deliveryFee,
                SubTotal = subtotal,
                Items = items
            };

            _context.Order.Add(order);
            _context.Baskets.Remove(basket);

            if(orderDto.SaveAddress)
            {
                var user = await _context.Users.Include(x => x.UserAddress).FirstOrDefaultAsync(x => x.UserName == User.Identity.Name);
                user.UserAddress = new UserAddress
                {
                    FullName = orderDto.ShippingAddress.FullName,
                    AddressLine1 = orderDto.ShippingAddress.AddressLine1,
                    AddressLine2 = orderDto.ShippingAddress.AddressLine2,
                    City = orderDto.ShippingAddress.City,
                    Country = orderDto.ShippingAddress.Country,
                    State = orderDto.ShippingAddress.State,
                    ZipCode = orderDto.ShippingAddress.ZipCode
                };
                _context.Update(user);
            }

            var success = await _context.SaveChangesAsync() > 0;

            if (success)
            {
                return CreatedAtRoute("GetOrder", new { id = order.Id }, order.Id);
            }

            return BadRequest("Problem creating order");
        }
    }
}