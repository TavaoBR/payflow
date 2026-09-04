using System.Text.Json.Serialization;

namespace PayFlow.Contracts.PaymentLinks;

public record PaymentLinkDto(
    [property: JsonPropertyName("id")] Guid Id,
    [property: JsonPropertyName("publicToken")] string PublicToken,
    [property: JsonPropertyName("title")] string Title,
    [property: JsonPropertyName("description")] string? Description,
    [property: JsonPropertyName("productId")] Guid? ProductId,
    [property: JsonPropertyName("productName")] string? ProductName,
    [property: JsonPropertyName("fixedAmount")] decimal? FixedAmount,
    [property: JsonPropertyName("currency")] string Currency,
    [property: JsonPropertyName("allowedMethods")] IReadOnlyList<string> AllowedMethods,
    [property: JsonPropertyName("pixDiscountPct")] decimal PixDiscountPct,
    [property: JsonPropertyName("maxInstallments")] int MaxInstallments,
    [property: JsonPropertyName("expiresAt")] DateTime? ExpiresAt,
    [property: JsonPropertyName("status")] string Status,
    [property: JsonPropertyName("checkoutUrl")] string CheckoutUrl,
    [property: JsonPropertyName("createdAt")] DateTime CreatedAt
);

public record CreatePaymentLinkRequest(
    [property: JsonPropertyName("title")] string Title,
    [property: JsonPropertyName("description")] string? Description,
    [property: JsonPropertyName("productId")] Guid? ProductId,
    [property: JsonPropertyName("fixedAmount")] decimal? FixedAmount,
    [property: JsonPropertyName("currency")] string? Currency,
    [property: JsonPropertyName("allowedMethods")] IReadOnlyList<string>? AllowedMethods,
    [property: JsonPropertyName("pixDiscountPct")] decimal? PixDiscountPct,
    [property: JsonPropertyName("maxInstallments")] int? MaxInstallments,
    [property: JsonPropertyName("expiresAt")] DateTime? ExpiresAt
);

public record UpdatePaymentLinkRequest(
    [property: JsonPropertyName("title")] string Title,
    [property: JsonPropertyName("description")] string? Description,
    [property: JsonPropertyName("fixedAmount")] decimal? FixedAmount,
    [property: JsonPropertyName("currency")] string? Currency,
    [property: JsonPropertyName("allowedMethods")] IReadOnlyList<string>? AllowedMethods,
    [property: JsonPropertyName("pixDiscountPct")] decimal? PixDiscountPct,
    [property: JsonPropertyName("maxInstallments")] int? MaxInstallments,
    [property: JsonPropertyName("expiresAt")] DateTime? ExpiresAt,
    [property: JsonPropertyName("status")] string? Status
);
