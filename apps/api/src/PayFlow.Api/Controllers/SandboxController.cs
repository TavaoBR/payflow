using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PayFlow.Application.Features.Sandbox;
using PayFlow.Contracts.Common;
using PayFlow.Contracts.Sandbox;

namespace PayFlow.Api.Controllers;

[AllowAnonymous]
[Route("api/v1/sandbox")]
public class SandboxController : ApiControllerBase
{
    private readonly ISandboxService _sandboxService;

    public SandboxController(ISandboxService sandboxService)
    {
        _sandboxService = sandboxService;
    }

    [HttpPost("transactions/{id:guid}/simulate")]
    [ProducesResponseType(typeof(ApiResponse<SimulateTransactionResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<SimulateTransactionResponse>>> SimulateTransaction(
        Guid id,
        [FromBody] SimulateTransactionRequest request,
        CancellationToken ct)
    {
        var response = await _sandboxService.SimulateTransactionAsync(id, request, ct);
        return OkResponse(response);
    }
}
