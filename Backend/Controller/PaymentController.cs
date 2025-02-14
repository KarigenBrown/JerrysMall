using Backend.Config.Db;
using Backend.Domain.Vo;
using Backend.Extension;
using Backend.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controller;

public class PaymentController(PaymentService paymentService, StoreContext context) : BackendController
{
    [HttpPost]
    [HttpPut]
    [Authorize]
    public async Task<ActionResult<BasketVo>> CreateOrUpdatePaymentIntent()
    {
        var basket = await context.Baskets
            .RetrieveBasketWithItems(User.Identity.Name)
            .FirstOrDefaultAsync();

        if (basket is null)
        {
            return NotFound();
        }

        var intent = await paymentService.CreateOrUpdatedPaymentIntent(basket);

        if (intent is null)
        {
            return BadRequest(new ProblemDetails
            {
                Title = "Problem creating payment intent"
            });
        }

        basket.PaymentIntentId ??= intent.Id;
        basket.ClientSecret ??= intent.ClientSecret;

        context.Update(basket);

        var result = await context.SaveChangesAsync() > 0;

        if (!result)
        {
            return BadRequest(new ProblemDetails
            {
                Title = "Problem updating basket with intent"
            });
        }

        return basket.MapBasketToVo();
    }
}