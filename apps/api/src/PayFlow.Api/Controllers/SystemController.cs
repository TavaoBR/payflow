using Microsoft.AspNetCore.Mvc;
using PayFlow.Contracts.Common;

namespace PayFlow.Api.Controllers;

[Route("api/v1/system")]
public class SystemController : ApiControllerBase
{
    [HttpGet("status")]
    [ProducesResponseType(typeof(ApiResponse<SystemStatusResponse>), StatusCodes.Status200OK)]
    public ActionResult<ApiResponse<SystemStatusResponse>> GetStatus()
    {
        var response = new SystemStatusResponse(
            ApiVersion: "v1",
            Environment: Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Development",
            ServerTimeUtc: DateTime.UtcNow,
            Status: "operational"
        );

        return OkResponse(response);
    }
}

public record SystemStatusResponse(
    string ApiVersion,
    string Environment,
    DateTime ServerTimeUtc,
    string Status
);
