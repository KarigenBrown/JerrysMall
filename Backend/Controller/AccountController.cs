using Backend.Config.Db;
using Backend.Domain.DTO;
using Backend.Domain.Entity;
using Backend.Domain.Vo;
using Backend.Extension;
using Backend.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controller;

public class AccountController(UserManager<User> userManager, TokenService tokenService, StoreContext context)
    : BackendController
{
    private const string BuyerId = "buyerId";

    [HttpPost("login")]
    public async Task<ActionResult<UserVo>> Login(LoginDto loginDto)
    {
        var user = await userManager.FindByNameAsync(loginDto.Username);
        if (user is null || !await userManager.CheckPasswordAsync(user, loginDto.Password))
        {
            return Unauthorized();
        }

        var userBasket = await RetrieveBasketAsync(loginDto.Username);
        var anonBasket = await RetrieveBasketAsync(Request.Cookies[BuyerId]);

        if (anonBasket is not null)
        {
            if (userBasket is not null)
            {
                context.Baskets.Remove(userBasket);
            }

            anonBasket.BuyerId = user.UserName;
            Response.Cookies.Delete(BuyerId);
            await context.SaveChangesAsync();
        }

        return new UserVo
        {
            Email = user.Email,
            Token = await tokenService.GenerateTokenAsync(user),
            Basket = anonBasket?.MapBasketToVo() ?? userBasket?.MapBasketToVo()
        };
    }

    [HttpPost("register")]
    public async Task<ActionResult> Register(RegisterDto registerDto)
    {
        var user = new User
        {
            UserName = registerDto.Username,
            Email = registerDto.Email
        };

        var result = await userManager.CreateAsync(user, registerDto.Password);

        if (!result.Succeeded)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(error.Code, error.Description);
            }

            return ValidationProblem();
        }

        await userManager.AddToRoleAsync(user, "Member");

        return StatusCode(StatusCodes.Status201Created);
    }

    [Authorize]
    [HttpGet("currentUser")]
    public async Task<ActionResult<UserVo>> GetCurrentUser()
    {
        var user = await userManager.FindByNameAsync(User.Identity.Name);

        var userBasket = await RetrieveBasketAsync(User.Identity.Name);

        return new UserVo
        {
            Email = user.Email,
            Token = await tokenService.GenerateTokenAsync(user),
            Basket = userBasket?.MapBasketToVo()
        };
    }

    [Authorize]
    [HttpGet("savedAddress")]
    public async Task<ActionResult<UserAddress>> GetSavedAddress()
    {
        return await userManager.Users
            .Where(x => x.UserName == User.Identity.Name)
            .Select(user => user.Address)
            .FirstOrDefaultAsync();
    }

    private async Task<Basket?> RetrieveBasketAsync(string? buyerId)
    {
        if (string.IsNullOrWhiteSpace(buyerId))
        {
            Response.Cookies.Delete(BuyerId);
            return null;
        }

        return await context.Baskets
            .Include(i => i.Items)
            .ThenInclude(p => p.Product)
            .FirstOrDefaultAsync(x => x.BuyerId == buyerId);
    }
}