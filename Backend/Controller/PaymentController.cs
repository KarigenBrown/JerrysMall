using Backend.Config.Db;
using Backend.Domain.Entity.OrderAggregate;
using Backend.Domain.Vo;
using Backend.Extension;
using Backend.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Stripe;

namespace Backend.Controller;

public class PaymentController(PaymentService paymentService, StoreContext context, IConfiguration config)
    : BackendController
{
    [HttpPost]
    [HttpPut]
    [Authorize]
    // 付款第一步,创建payment intent
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

    [HttpPost("webhook")]
    [HttpPut("status")]
    // 付款第四步,通过strip服务器的webhook完成自己服务器付款过程
    public async Task<ActionResult> StripeWebhook()
    {
        var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();

        var stripeEvent = EventUtility.ConstructEvent(json, Request.Headers["Stripe-Signature"],
            config["StripeSettings:WhSecret"]);

        var charge = stripeEvent.Data.Object as Charge;

        var order = await context.Orders.FirstOrDefaultAsync(x => x.PaymentIntentId == charge.PaymentIntentId);

        if (charge.Status == "succeed")
        {
            order.OrderStatus = OrderStatus.PaymentReceived;
        }

        await context.SaveChangesAsync();

        return new EmptyResult();
    }
}