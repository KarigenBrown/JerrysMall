using Amazon.S3;
using Amazon.S3.Model;

namespace Backend.Service;

public class FileService(IAmazonS3 s3Client)
{
    private const string BucketName = "jerrysmall";

    public async Task<string> UploadFileAsync(IFormFile file)
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
            Expires = DateTime.UtcNow.AddDays(7),
            Protocol = Protocol.HTTP
        };
        return await s3Client.GetPreSignedURLAsync(getRequest);
    }

    public async Task<GetObjectResponse> GetFileAsync(string key)
    {
        return await s3Client.GetObjectAsync(BucketName, key);
    }

    public async Task<DeleteObjectResponse> DeleteFileAsync(string key)
    {
        return await s3Client.DeleteObjectAsync(BucketName, key);
    }
}