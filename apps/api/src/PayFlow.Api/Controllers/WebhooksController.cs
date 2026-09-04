using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PayFlow.Application.Features.Webhooks;
using PayFlow.Contracts.Common;
using PayFlow.Contracts.Webhooks;

namespace PayFlow.Api.Controllers;

[Authorize]
[Route("api/v1/webhooks")]
public class WebhooksController : ApiControllerBase
{
    private readonly IWebhookService _webhookService;

    public WebhooksController(IWebhookService webhookService)
    {
        _webhookService = webhookService;
    }

    [HttpGet("endpoints")]
    [ProducesResponseType(typeof(ApiResponse<IReadOnlyList<WebhookEndpointDto>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<WebhookEndpointDto>>>> GetEndpoints(CancellationToken ct)
    {
        var endpoints = await _webhookService.GetEndpointsAsync(ct);
        return OkResponse(endpoints);
    }

    [HttpPost("endpoints")]
    [ProducesResponseType(typeof(ApiResponse<WebhookEndpointCreatedDto>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ApiResponse<WebhookEndpointCreatedDto>>> CreateEndpoint(
        [FromBody] CreateWebhookEndpointRequest request,
        CancellationToken ct)
    {
        var endpoint = await _webhookService.CreateEndpointAsync(request, ct);
        return StatusCode(StatusCodes.Status201Created, ApiResponse<WebhookEndpointCreatedDto>.Ok(endpoint, "Endpoint de webhook cadastrado com sucesso. Guarde o secret gerado!"));
    }

    [HttpPut("endpoints/{id:guid}")]
    [ProducesResponseType(typeof(ApiResponse<WebhookEndpointDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<WebhookEndpointDto>>> UpdateEndpoint(
        Guid id,
        [FromBody] UpdateWebhookEndpointRequest request,
        CancellationToken ct)
    {
        var endpoint = await _webhookService.UpdateEndpointAsync(id, request, ct);
        return OkResponse(endpoint, "Endpoint de webhook atualizado com sucesso.");
    }

    [HttpDelete("endpoints/{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteEndpoint(Guid id, CancellationToken ct)
    {
        await _webhookService.DeleteEndpointAsync(id, ct);
        return NoContent();
    }
}
