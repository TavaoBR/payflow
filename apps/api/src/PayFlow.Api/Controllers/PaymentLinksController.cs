using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PayFlow.Application.Features.PaymentLinks;
using PayFlow.Contracts.Common;
using PayFlow.Contracts.PaymentLinks;

namespace PayFlow.Api.Controllers;

[Authorize]
[Route("api/v1/payment-links")]
public class PaymentLinksController : ApiControllerBase
{
    private readonly IPaymentLinkService _paymentLinkService;

    public PaymentLinksController(IPaymentLinkService paymentLinkService)
    {
        _paymentLinkService = paymentLinkService;
    }

    [HttpGet]
    [ProducesResponseType(typeof(PagedApiResponse<PaymentLinkDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<PagedApiResponse<PaymentLinkDto>>> GetPaymentLinks([FromQuery] PagedFilterParams filter, CancellationToken ct)
    {
        var response = await _paymentLinkService.GetPaymentLinksPagedAsync(filter, ct);
        return Ok(response);
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(ApiResponse<PaymentLinkDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<PaymentLinkDto>>> GetById(Guid id, CancellationToken ct)
    {
        var link = await _paymentLinkService.GetPaymentLinkByIdAsync(id, ct);
        return OkResponse(link);
    }

    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<PaymentLinkDto>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ApiResponse<PaymentLinkDto>>> CreatePaymentLink([FromBody] CreatePaymentLinkRequest request, CancellationToken ct)
    {
        var link = await _paymentLinkService.CreatePaymentLinkAsync(request, ct);
        return StatusCode(StatusCodes.Status201Created, ApiResponse<PaymentLinkDto>.Ok(link, "Link de pagamento criado com sucesso."));
    }

    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(ApiResponse<PaymentLinkDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<PaymentLinkDto>>> UpdatePaymentLink(Guid id, [FromBody] UpdatePaymentLinkRequest request, CancellationToken ct)
    {
        var link = await _paymentLinkService.UpdatePaymentLinkAsync(id, request, ct);
        return OkResponse(link, "Link de pagamento atualizado com sucesso.");
    }

    [HttpPost("{id:guid}/pause")]
    [ProducesResponseType(typeof(ApiResponse<PaymentLinkDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<PaymentLinkDto>>> Pause(Guid id, CancellationToken ct)
    {
        var link = await _paymentLinkService.PausePaymentLinkAsync(id, ct);
        return OkResponse(link, "Link de pagamento pausado com sucesso.");
    }

    [HttpPost("{id:guid}/activate")]
    [ProducesResponseType(typeof(ApiResponse<PaymentLinkDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<PaymentLinkDto>>> Activate(Guid id, CancellationToken ct)
    {
        var link = await _paymentLinkService.ActivatePaymentLinkAsync(id, ct);
        return OkResponse(link, "Link de pagamento ativado com sucesso.");
    }
}
