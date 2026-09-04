using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PayFlow.Application.Features.CheckoutSettings;
using PayFlow.Contracts.CheckoutSettings;
using PayFlow.Contracts.Common;

namespace PayFlow.Api.Controllers;

[Authorize]
[Route("api/v1/checkout-settings")]
public class CheckoutSettingsController : ApiControllerBase
{
    private readonly ICheckoutSettingsService _settingsService;

    public CheckoutSettingsController(ICheckoutSettingsService settingsService)
    {
        _settingsService = settingsService;
    }

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<CheckoutSettingsDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<CheckoutSettingsDto>>> GetSettings(CancellationToken ct)
    {
        var settings = await _settingsService.GetSettingsAsync(ct);
        return OkResponse(settings);
    }

    [HttpPut]
    [ProducesResponseType(typeof(ApiResponse<CheckoutSettingsDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ApiResponse<CheckoutSettingsDto>>> UpdateSettings([FromBody] UpdateCheckoutSettingsRequest request, CancellationToken ct)
    {
        var settings = await _settingsService.UpdateSettingsAsync(request, ct);
        return OkResponse(settings, "Configurações de checkout atualizadas com sucesso.");
    }
}
