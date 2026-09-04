using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PayFlow.Application.Features.PublicCheckout;
using PayFlow.Contracts.Common;
using PayFlow.Contracts.PublicCheckout;

namespace PayFlow.Api.Controllers;

[AllowAnonymous]
[Route("api/v1/public")]
public class PublicCheckoutController : ApiControllerBase
{
    private readonly IPublicCheckoutService _publicCheckoutService;

    public PublicCheckoutController(IPublicCheckoutService publicCheckoutService)
    {
        _publicCheckoutService = publicCheckoutService;
    }

    [HttpGet("checkouts/{token}")]
    [ProducesResponseType(typeof(ApiResponse<PublicCheckoutDetailsResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<PublicCheckoutDetailsResponse>>> GetCheckoutDetails(string token, CancellationToken ct)
    {
        var details = await _publicCheckoutService.GetPublicCheckoutAsync(token, ct);
        return OkResponse(details);
    }

    [HttpPost("checkouts/{token}/sessions")]
    [ProducesResponseType(typeof(ApiResponse<CheckoutSessionResponse>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<CheckoutSessionResponse>>> CreateSession(
        string token,
        [FromBody] CreateCheckoutSessionRequest request,
        CancellationToken ct)
    {
        var session = await _publicCheckoutService.CreateCheckoutSessionAsync(token, request, ct);
        return StatusCode(StatusCodes.Status201Created, ApiResponse<CheckoutSessionResponse>.Ok(session, "Sessão de checkout iniciada."));
    }

    [HttpPost("checkout-sessions/{id:guid}/payments/pix")]
    [ProducesResponseType(typeof(ApiResponse<PixPaymentResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<PixPaymentResponse>>> PayPix(Guid id, CancellationToken ct)
    {
        var response = await _publicCheckoutService.PayPixAsync(id, ct);
        return OkResponse(response, "Cobrança PIX gerada com sucesso.");
    }

    [HttpPost("checkout-sessions/{id:guid}/payments/card")]
    [ProducesResponseType(typeof(ApiResponse<CardPaymentResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<CardPaymentResponse>>> PayCard(
        Guid id,
        [FromBody] CardPaymentRequest request,
        CancellationToken ct)
    {
        var response = await _publicCheckoutService.PayCardAsync(id, request, ct);
        return OkResponse(response);
    }

    [HttpPost("checkout-sessions/{id:guid}/payments/boleto")]
    [ProducesResponseType(typeof(ApiResponse<BoletoPaymentResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<BoletoPaymentResponse>>> PayBoleto(Guid id, CancellationToken ct)
    {
        var response = await _publicCheckoutService.PayBoletoAsync(id, ct);
        return OkResponse(response, "Boleto bancário gerado com sucesso.");
    }

    [HttpGet("payment-transactions/{id:guid}/status")]
    [ProducesResponseType(typeof(ApiResponse<PublicTransactionStatusResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<PublicTransactionStatusResponse>>> GetTransactionStatus(Guid id, CancellationToken ct)
    {
        var status = await _publicCheckoutService.GetPublicTransactionStatusAsync(id, ct);
        return OkResponse(status);
    }
}
