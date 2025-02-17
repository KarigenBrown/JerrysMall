using System.Net.Mime;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controller;

[AllowAnonymous]
public class FallbackController : Microsoft.AspNetCore.Mvc.Controller
{
    public IActionResult Index()
    {
        return PhysicalFile(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "index.html"),
            MediaTypeNames.Text.Html);
    }
}