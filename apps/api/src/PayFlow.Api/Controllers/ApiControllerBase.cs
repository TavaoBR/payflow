using Microsoft.AspNetCore.Mvc;
using PayFlow.Contracts.Common;

namespace PayFlow.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Produces("application/json")]
[ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status500InternalServerError)]
public abstract class ApiControllerBase : ControllerBase
{
    protected ActionResult<ApiResponse<T>> OkResponse<T>(T data, string? message = null)
    {
        return Ok(ApiResponse<T>.Ok(data, message));
    }

    protected ActionResult<PagedApiResponse<T>> PagedResponse<T>(IEnumerable<T> items, int page, int perPage, long total, string? message = null)
    {
        return Ok(PagedApiResponse<T>.Ok(items, page, perPage, total, message));
    }
}
