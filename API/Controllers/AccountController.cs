using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly UserManager<User> _userManager;
        private readonly TokenService _tokenService;
        private readonly ProductContext _context;

        public AccountController(UserManager<User> userManager, TokenService tokenService, ProductContext context)
        {
            _userManager = userManager;
            _tokenService = tokenService;
            _context = context;
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _userManager.FindByNameAsync(loginDto.UserName);
            if (user is null || !await _userManager.CheckPasswordAsync(user, loginDto.Password)) return Unauthorized();

            var userBasket = await RetrieveBasket(loginDto.UserName);
            var anonymousBasket = await RetrieveBasket(Request.Cookies["buyerId"]);

            if (anonymousBasket is not null)
            {
                if (userBasket is not null)
                {
                    _context.Baskets.Remove(userBasket);
                }
                anonymousBasket.BuyerId = user.UserName;
                Response.Cookies.Delete("buyerId");
                await _context.SaveChangesAsync();
            }

            return new UserDto
            {
                Email = user.Email,
                Token = await _tokenService.CreateToken(user),
                Basket = anonymousBasket is not null ? anonymousBasket.MapBasketEntityToDto() : userBasket is not null ? userBasket.MapBasketEntityToDto() : null
            };
        }

        [HttpPost("register")]
        public async Task<ActionResult> Register(RegisterDto registerDto)
        {
            var user = new User { UserName = registerDto.UserName, Email = registerDto.Email };

            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (!result.Succeeded) return BadRequest(result.Errors);

            await _userManager.AddToRoleAsync(user, "Member");
            return Ok();
        }

        [Authorize]
        [HttpGet("currentUser")]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var user = await _userManager.FindByNameAsync(User.Identity.Name);
            var userBasket = await RetrieveBasket(User.Identity.Name);
            return new UserDto
            {
                Email = user.Email,
                Token = await _tokenService.CreateToken(user),
                Basket = userBasket?.MapBasketEntityToDto()
            };
        }

        [Authorize]
        [HttpGet("savedAddress")]
        public async Task<ActionResult<UserAddress>> GetSavedAddress()
        {
            var user = await _userManager.Users.Include(x => x.UserAddress).FirstAsync(x => x.UserName == User.Identity.Name);
            return user?.UserAddress;
        }

        private async Task<Basket> RetrieveBasket(string buyerId)
        {
            if (string.IsNullOrEmpty(buyerId))
            {
                Response.Cookies.Delete("buyerId");
                return null;
            }
            return await _context.Baskets
                            .Include(x => x.Items)
                            .ThenInclude(x => x.Product)
                            .FirstOrDefaultAsync(x => x.BuyerId == buyerId);
        }
    }
}