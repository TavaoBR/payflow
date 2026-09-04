using PayFlow.Application.Abstractions;
using PayFlow.Application.Exceptions;
using PayFlow.Contracts.CheckoutSettings;
using PayFlow.Domain.Entities;

namespace PayFlow.Application.Features.CheckoutSettings;

public interface ICheckoutSettingsService
{
    Task<CheckoutSettingsDto> GetSettingsAsync(CancellationToken ct = default);
    Task<CheckoutSettingsDto> UpdateSettingsAsync(UpdateCheckoutSettingsRequest request, CancellationToken ct = default);
}

public class CheckoutSettingsService : ICheckoutSettingsService
{
    private readonly ICheckoutBrandingRepository _brandingRepository;
    private readonly ITenantContext _tenantContext;
    private readonly IAuditService _auditService;

    public CheckoutSettingsService(
        ICheckoutBrandingRepository brandingRepository,
        ITenantContext tenantContext,
        IAuditService auditService)
    {
        _brandingRepository = brandingRepository;
        _tenantContext = tenantContext;
        _auditService = auditService;
    }

    public async Task<CheckoutSettingsDto> GetSettingsAsync(CancellationToken ct = default)
    {
        var tenantId = _tenantContext.CurrentTenantId ?? throw new UnauthorizedException("Tenant não identificado.");
        var branding = await _brandingRepository.GetByTenantIdAsync(tenantId, ct);

        if (branding == null)
        {
            branding = new CheckoutBranding
            {
                TenantId = tenantId,
                PrimaryColor = "#2563eb",
                SecondaryColor = "#0f172a",
                FontFamily = "Geist",
                RadiusPreset = "rounded-lg",
                CtaText = "Finalizar Pagamento",
                SuccessTitle = "Pagamento Confirmado!",
                SuccessMessage = "Obrigado por sua compra. Enviamos a confirmação para o seu e-mail.",
                RedirectDelaySeconds = 5
            };
            await _brandingRepository.AddOrUpdateAsync(branding, ct);
            await _brandingRepository.SaveChangesAsync(ct);
        }

        return MapToDto(branding);
    }

    public async Task<CheckoutSettingsDto> UpdateSettingsAsync(UpdateCheckoutSettingsRequest request, CancellationToken ct = default)
    {
        var tenantId = _tenantContext.CurrentTenantId ?? throw new UnauthorizedException("Tenant não identificado.");
        var branding = await _brandingRepository.GetByTenantIdAsync(tenantId, ct);

        if (branding == null)
        {
            branding = new CheckoutBranding { TenantId = tenantId };
        }

        if (!string.IsNullOrWhiteSpace(request.LogoUrl))
            branding.LogoUrl = request.LogoUrl.Trim();

        if (!string.IsNullOrWhiteSpace(request.PrimaryColor))
            branding.PrimaryColor = request.PrimaryColor.Trim();

        if (!string.IsNullOrWhiteSpace(request.SecondaryColor))
            branding.SecondaryColor = request.SecondaryColor.Trim();

        if (!string.IsNullOrWhiteSpace(request.FontFamily))
            branding.FontFamily = request.FontFamily.Trim();

        if (!string.IsNullOrWhiteSpace(request.RadiusPreset))
            branding.RadiusPreset = request.RadiusPreset.Trim();

        if (!string.IsNullOrWhiteSpace(request.CtaText))
            branding.CtaText = request.CtaText.Trim();

        if (!string.IsNullOrWhiteSpace(request.SuccessTitle))
            branding.SuccessTitle = request.SuccessTitle.Trim();

        if (!string.IsNullOrWhiteSpace(request.SuccessMessage))
            branding.SuccessMessage = request.SuccessMessage.Trim();

        branding.RedirectUrl = request.RedirectUrl?.Trim();

        if (request.RedirectDelaySeconds.HasValue)
            branding.RedirectDelaySeconds = Math.Clamp(request.RedirectDelaySeconds.Value, 0, 60);

        await _brandingRepository.AddOrUpdateAsync(branding, ct);
        await _brandingRepository.SaveChangesAsync(ct);

        await _auditService.LogAsync("checkout_settings.update", "CheckoutBranding", branding.Id, new { branding.PrimaryColor, branding.FontFamily }, ct);

        return MapToDto(branding);
    }

    private static CheckoutSettingsDto MapToDto(CheckoutBranding b) => new(
        b.TenantId,
        b.LogoUrl,
        b.PrimaryColor,
        b.SecondaryColor,
        b.FontFamily,
        b.RadiusPreset,
        b.CtaText,
        b.SuccessTitle,
        b.SuccessMessage,
        b.RedirectUrl,
        b.RedirectDelaySeconds
    );
}
