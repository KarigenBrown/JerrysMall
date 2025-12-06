using Microsoft.AspNetCore.Mvc;

namespace Backend.Controller;

[ApiController]
[Route("/Backend/[controller]/")]
// [Route("/Backend/[controller]/[action]")]
public class BackendController : ControllerBase;