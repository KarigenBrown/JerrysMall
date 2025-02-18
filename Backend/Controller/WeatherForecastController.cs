using Amazon.S3;
using Amazon.S3.Model;
using Backend.Domain.Entity;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controller;

[ApiController]
[Route("[controller]")]
public class WeatherForecastController(ILogger<WeatherForecastController> logger, IAmazonS3 s3Client) : ControllerBase
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
        await using var inputStream = file.OpenReadStream();

        var originalFileName = file.FileName;
        var index = originalFileName.LastIndexOf('.');
        var fileType = originalFileName[(index + 1)..];
        var filename = $"{DateTime.Now:yyyy/M/d}/{Guid.NewGuid():N}.{fileType}";

        var putRequest = new PutObjectRequest()
        {
            BucketName = BucketName,
            Key = filename,
            InputStream = inputStream,
            ContentType = file.ContentType
        };
        var response = await s3Client.PutObjectAsync(putRequest);

        var getRequest = new GetPreSignedUrlRequest
        {
            BucketName = BucketName,
            Key = filename,
            Verb = HttpVerb.GET,
            Expires = DateTime.UtcNow.AddHours(12)
        };
        return await s3Client.GetPreSignedURLAsync(getRequest);
    }

    [HttpGet("download")]
    public async Task<IActionResult> GetFileByKeyAsync(string key)
    {
        var s3Object = await s3Client.GetObjectAsync(BucketName, key);
        return File(s3Object.ResponseStream, s3Object.Headers.ContentType);
    }
}