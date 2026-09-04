using System.Text.Json.Serialization;

namespace PayFlow.Contracts.CheckoutSettings;

public record CheckoutSettingsDto(
    [property: JsonPropertyName("tenantId")] Guid TenantId,
    [property: JsonPropertyName("logoUrl")] string? LogoUrl,
    [property: JsonPropertyName("primaryColor")] string PrimaryColor,
    [property: JsonPropertyName("secondaryColor")] string SecondaryColor,
    [property: JsonPropertyName("fontFamily")] string FontFamily,
    [property: JsonPropertyName("radiusPreset")] string RadiusPreset,
    [property: JsonPropertyName("ctaText")] string CtaText,
    [property: JsonPropertyName("successTitle")] string SuccessTitle,
    [property: JsonPropertyName("successMessage")] string SuccessMessage,
    [property: JsonPropertyName("redirectUrl")] string? RedirectUrl,
    [property: JsonPropertyName("redirectDelaySeconds")] int RedirectDelaySeconds
);

public record UpdateCheckoutSettingsRequest(
    [property: JsonPropertyName("logoUrl")] string? LogoUrl,
    [property: JsonPropertyName("primaryColor")] string? PrimaryColor,
    [property: JsonPropertyName("secondaryColor")] string? SecondaryColor,
    [property: JsonPropertyName("fontFamily")] string? FontFamily,
    [property: JsonPropertyName("radiusPreset")] string? RadiusPreset,
    [property: JsonPropertyName("ctaText")] string? CtaText,
    [property: JsonPropertyName("successTitle")] string? SuccessTitle,
    [property: JsonPropertyName("successMessage")] string? SuccessMessage,
    [property: JsonPropertyName("redirectUrl")] string? RedirectUrl,
    [property: JsonPropertyName("redirectDelaySeconds")] int? RedirectDelaySeconds
);
