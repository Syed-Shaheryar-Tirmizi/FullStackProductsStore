using API.Data;
using API.DTOs;
using API.Entities.OrderAggregate;
using API.Extensions;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Stripe;

namespace API.Controllers
{
    public class PaymentController : BaseApiController
    {
        private PaymentService _paymentService;
        private ProductContext _context;
        private IConfiguration _config;

        public PaymentController(PaymentService paymentService, ProductContext context, IConfiguration config)
        {
            _paymentService = paymentService;
            _context = context;
            _config = config;
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<BasketDto>> CreateOrUpdatePaymentIntent()
        {
            var basket = await _context.Baskets.RetrieveBasketWithItems(User.Identity.Name).FirstOrDefaultAsync();

            if (basket is null) 
            {
                return NotFound();
            }

            var paymentIntent = await _paymentService.CreateOrUpdatePaymentIntent(basket);

            if (paymentIntent is null)
            {
                return BadRequest(new ProblemDetails { Title = "Problem with your payment" });
            }

            basket.PaymentIntentId ??= paymentIntent.Id;
            basket.ClientSecret ??= paymentIntent.ClientSecret;

            _context.Update(basket);
            var result = await _context.SaveChangesAsync();

            if (result > 0) 
            {
                return basket.MapBasketEntityToDto();
            }

            return BadRequest(new ProblemDetails { Title = "Problem with your payment" });
        }

        [HttpPost("webhook")]
        public async Task<ActionResult> StripeWebhook()
        {
            var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
            var stripeEvent = EventUtility.ConstructEvent(json, Request.Headers["Stripe-Signature"], 
                _config["StripeSettings:WhSecret"]);
            var charge = (Charge)stripeEvent.Data.Object;

            var order = await _context.Order.FirstOrDefaultAsync(x => x.PaymentIntentId == charge.PaymentIntentId);

            if(charge.Status == "succeeded")
            {
                order.Status = OrderStatus.PaymentReceived;

                _context.Update(order);

                await _context.SaveChangesAsync();
            }

            return new EmptyResult();
        }
    }
}