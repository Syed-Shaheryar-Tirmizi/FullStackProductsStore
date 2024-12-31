using Microsoft.AspNetCore.Identity;

namespace API.Entities
{
    public class User : IdentityUser<int>
    {
        public UserAddress UserAddress { get; set; }
    }
}