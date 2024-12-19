using API.Data;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class BasketController : BaseApiController
    {
        private readonly ProductContext _productContext;

        public BasketController(ProductContext productContext)
        {
            _productContext = productContext;
        }

        [HttpGet(Name = "GetBasket")]
        public async Task<ActionResult<BasketDto>> GetBasket()
        {
            var basket = await RetrieveBasket();

            if (basket is null) return NotFound();
            return MapBasketEntityToDto(basket);
        }

        [HttpPost]
        public async Task<ActionResult<BasketDto>> AddItemToBasket(int productId, int quantity)
        {
            var basket = await RetrieveBasket();
            basket ??= CreateBasket();

            var product = await _productContext.Products.FindAsync(productId);
            if (product is null) return NotFound();

            basket.AddItem(product, quantity);
            var success = await _productContext.SaveChangesAsync() > 0;

            if (success) return CreatedAtRoute("GetBasket", MapBasketEntityToDto(basket));
            return BadRequest(new ProblemDetails { Title = "Problem saving item to basket" });
        }

        [HttpDelete]
        public async Task<ActionResult> RemoveItemFromBasket(int productId, int quantity)
        {
            var basket = await RetrieveBasket();
            var item = basket.Items.FirstOrDefault(x => x.ProductId == productId);
            if (item is null) return NotFound(new ProblemDetails { Title = "Product not found in basket" });

            basket.RemoveItem(productId, quantity);
            var success = await _productContext.SaveChangesAsync() > 0;

            if (success) return Ok();
            return BadRequest(new ProblemDetails { Title = "Problem removing product from basket" });
        }

        private async Task<Basket> RetrieveBasket()
        {
            return await _productContext.Baskets
                            .Include(x => x.Items)
                            .ThenInclude(x => x.Product)
                            .FirstOrDefaultAsync(x => x.BuyerId == Request.Cookies["buyerId"]);
        }

        private Basket CreateBasket()
        {
            var buyerId = Guid.NewGuid().ToString();
            var cookiesOptions = new CookieOptions { IsEssential = true, Expires = DateTime.Now.AddDays(30) };
            Response.Cookies.Append("buyerId", buyerId, cookiesOptions);
            var basket = new Basket { BuyerId = buyerId };
            _productContext.Baskets.Add(basket);
            return basket;
        }

        private BasketDto MapBasketEntityToDto(Basket basket)
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
    }
}