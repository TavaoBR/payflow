using Microsoft.AspNetCore.Mvc;
using PayFlow.Contracts.Common;

namespace PayFlow.Api.Controllers;

[ApiController]
[Route("health")]
public class HealthController : ControllerBase
{
    [HttpGet("live")]
    public ActionResult<ApiResponse<object>> Live()
    {
        return Ok(ApiResponse<object>.Ok(new
        {
            status = "healthy",
            timestamp = DateTime.UtcNow
        }));
    }

    [HttpGet("ready")]
    public ActionResult<ApiResponse<object>> Ready()
    {
        return Ok(ApiResponse<object>.Ok(new
        {
            status = "ready",
            timestamp = DateTime.UtcNow
        }));
    }
}
