using Microsoft.AspNetCore.Identity;

namespace Backend.Domain.Entity;

public class User : IdentityUser<int>
{
    public UserAddress Address { get; set; }
    
}