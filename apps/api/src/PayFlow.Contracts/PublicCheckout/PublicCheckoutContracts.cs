using System.Text.Json.Serialization;
using PayFlow.Contracts.CheckoutSettings;

namespace PayFlow.Contracts.PublicCheckout;

public record PublicProductDto(
    [property: JsonPropertyName("id")] Guid Id,
    [property: JsonPropertyName("name")] string Name,
    [property: JsonPropertyName("description")] string? Description,
    [property: JsonPropertyName("imageUrl")] string? ImageUrl,
    [property: JsonPropertyName("priceAmount")] decimal PriceAmount,
    [property: JsonPropertyName("currency")] string Currency
);

public record PublicCheckoutDetailsResponse(
    [property: JsonPropertyName("paymentLinkId")] Guid PaymentLinkId,
    [property: JsonPropertyName("publicToken")] string PublicToken,
    [property: JsonPropertyName("title")] string Title,
    [property: JsonPropertyName("description")] string? Description,
    [property: JsonPropertyName("amount")] decimal Amount,
    [property: JsonPropertyName("currency")] string Currency,
    [property: JsonPropertyName("allowedMethods")] IReadOnlyList<string> AllowedMethods,
    [property: JsonPropertyName("pixDiscountPct")] decimal PixDiscountPct,
    [property: JsonPropertyName("maxInstallments")] int MaxInstallments,
    [property: JsonPropertyName("expiresAt")] DateTime? ExpiresAt,
    [property: JsonPropertyName("status")] string Status,
    [property: JsonPropertyName("branding")] CheckoutSettingsDto Branding,
    [property: JsonPropertyName("product")] PublicProductDto? Product
);

public record CreateCheckoutSessionRequest(
    [property: JsonPropertyName("customerName")] string CustomerName,
    [property: JsonPropertyName("customerEmail")] string CustomerEmail,
    [property: JsonPropertyName("customerPhone")] string? CustomerPhone,
    [property: JsonPropertyName("customerDocument")] string? CustomerDocument
);

public record CheckoutSessionResponse(
    [property: JsonPropertyName("sessionId")] Guid SessionId,
    [property: JsonPropertyName("publicToken")] string PublicToken,
    [property: JsonPropertyName("orderId")] Guid OrderId,
    [property: JsonPropertyName("orderPublicCode")] string OrderPublicCode,
    [property: JsonPropertyName("totalAmount")] decimal TotalAmount,
    [property: JsonPropertyName("currency")] string Currency,
    [property: JsonPropertyName("expiresAt")] DateTime ExpiresAt
);

public record PixPaymentResponse(
    [property: JsonPropertyName("transactionId")] Guid TransactionId,
    [property: JsonPropertyName("status")] string Status,
    [property: JsonPropertyName("amount")] decimal Amount,
    [property: JsonPropertyName("currency")] string Currency,
    [property: JsonPropertyName("qrCode")] string QrCode,
    [property: JsonPropertyName("qrCodeUrl")] string QrCodeUrl,
    [property: JsonPropertyName("expiration")] DateTime Expiration
);

public record CardPaymentRequest(
    [property: JsonPropertyName("holderName")] string HolderName,
    [property: JsonPropertyName("cardNumber")] string CardNumber,
    [property: JsonPropertyName("expiration")] string Expiration,
    [property: JsonPropertyName("cvv")] string Cvv,
    [property: JsonPropertyName("installments")] int Installments
);

public record CardPaymentResponse(
    [property: JsonPropertyName("transactionId")] Guid TransactionId,
    [property: JsonPropertyName("status")] string Status,
    [property: JsonPropertyName("amount")] decimal Amount,
    [property: JsonPropertyName("currency")] string Currency,
    [property: JsonPropertyName("failureReason")] string? FailureReason,
    [property: JsonPropertyName("paidAt")] DateTime? PaidAt
);

public record BoletoPaymentResponse(
    [property: JsonPropertyName("transactionId")] Guid TransactionId,
    [property: JsonPropertyName("status")] string Status,
    [property: JsonPropertyName("amount")] decimal Amount,
    [property: JsonPropertyName("currency")] string Currency,
    [property: JsonPropertyName("barcode")] string Barcode,
    [property: JsonPropertyName("boletoUrl")] string BoletoUrl,
    [property: JsonPropertyName("dueDate")] DateTime DueDate
);

public record PublicTransactionStatusResponse(
    [property: JsonPropertyName("transactionId")] Guid TransactionId,
    [property: JsonPropertyName("status")] string Status,
    [property: JsonPropertyName("method")] string Method,
    [property: JsonPropertyName("amount")] decimal Amount,
    [property: JsonPropertyName("currency")] string Currency,
    [property: JsonPropertyName("paidAt")] DateTime? PaidAt,
    [property: JsonPropertyName("failureCode")] string? FailureCode
);
