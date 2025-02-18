using Amazon.S3;
using Amazon.S3.Model;
using Backend.Domain.Entity;
using Backend.Service;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controller;

[ApiController]
[Route("[controller]")]
public class WeatherForecastController(ILogger<WeatherForecastController> logger, FileService fileService)
    : ControllerBase
{
    private static readonly string[] Summaries =
        ["Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"];

    private const string BucketName = "jerrysmall";

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