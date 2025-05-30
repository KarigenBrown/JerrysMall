using Amazon.S3;
using Amazon.S3.Model;
using Backend.Domain.Entity;
using Backend.Service;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controller;

/*
 * 特殊route
 * 1. `[controller]`: 用来表示Controller的类名,会自动忽略Controller后缀
 * 2. `[action]`: 用来表示方法名
 *
 * ControllerBase提供基础功能,提供返回类型/常用属性,可以是视图控制器
 * ApiController用于自动增强API行为,参数绑定,明确为api控制器
 */
[ApiController]
[Route("[controller]")]
public class WeatherForecastController(ILogger<WeatherForecastController> logger, FileService fileService)
    : ControllerBase
{
    private static readonly string[] Summaries =
        ["Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"];

    private const string BucketName = "jerrysmall";

    /*
     * http类型属性: HttpPost, HttpDelete, HttpPut, HttpPatch, HttpGet
     * template是实际的路径,不以/开头时会自动拼接外围路径(相对路径),以/开头时,路径就是这个(绝对路径)
     * Name是后端用来跳转时候使用的,对前端没有任何作用
     */
    [HttpGet(Name = "GetWeatherForecast")]
    public IEnumerable<WeatherForecast> Get()
    {
        logger.LogInformation("test");
        return Enumerable.Range(1, 5).Select(index => new WeatherForecast
            {
                Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
                TemperatureC = Random.Shared.Next(-20, 55),
                Summary = Summaries[Random.Shared.Next(Summaries.Length)]
            })
            .ToArray();
    }

    [HttpPost("upload")]
    public async Task<ActionResult<string>> UploadFileAsync(IFormFile file)
    {
        return await fileService.UploadFileAsync(file);
    }

    [HttpGet("download")]
    public async Task<IActionResult> GetFileByKeyAsync(string key)
    {
        var file = await fileService.GetFileAsync(key);
        return File(file.ResponseStream, file.Headers.ContentType);
    }
}