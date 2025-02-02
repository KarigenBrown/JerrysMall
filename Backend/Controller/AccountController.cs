using Backend.Domain.DTO;
using Backend.Domain.Entity;
using Backend.Domain.Vo;
using Backend.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controller;

public class AccountController(UserManager<User> userManager, TokenService tokenService) : BackendController
{
    [HttpPost("login")]
    public async Task<ActionResult<UserVo>> Login(LoginDto loginDto)
    {
        var user = await userManager.FindByNameAsync(loginDto.Username);
        if (user is null || !await userManager.CheckPasswordAsync(user, loginDto.Password))
        {
            return Unauthorized();
        }

        return new UserVo
        {
            Email = user.Email,
            Token = await tokenService.GenerateTokenAsync(user)
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

        return new UserVo
        {
            Email = user.Email,
            Token = await tokenService.GenerateTokenAsync(user)
        };
    }
}