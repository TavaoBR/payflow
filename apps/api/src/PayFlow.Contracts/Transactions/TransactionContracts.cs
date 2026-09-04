using System.Text.Json.Serialization;

namespace PayFlow.Contracts.Transactions;

public record TransactionMetadataDto(
    [property: JsonPropertyName("brand")] string? Brand,
    [property: JsonPropertyName("last4")] string? Last4,
    [property: JsonPropertyName("installments")] int? Installments,
    [property: JsonPropertyName("pixExpiration")] DateTime? PixExpiration,
    [property: JsonPropertyName("pixQrCode")] string? PixQrCode,
    [property: JsonPropertyName("pixQrCodeUrl")] string? PixQrCodeUrl,
    [property: JsonPropertyName("boletoDueDate")] DateTime? BoletoDueDate,
    [property: JsonPropertyName("boletoBarcode")] string? BoletoBarcode,
    [property: JsonPropertyName("boletoUrl")] string? BoletoUrl
);

public record RefundDto(
    [property: JsonPropertyName("id")] Guid Id,
    [property: JsonPropertyName("paymentTransactionId")] Guid PaymentTransactionId,
    [property: JsonPropertyName("amount")] decimal Amount,
    [property: JsonPropertyName("status")] string Status,
    [property: JsonPropertyName("reason")] string Reason,
    [property: JsonPropertyName("processedAt")] DateTime? ProcessedAt,
    [property: JsonPropertyName("createdAt")] DateTime CreatedAt
);

public record TransactionDto(
    [property: JsonPropertyName("id")] Guid Id,
    [property: JsonPropertyName("orderId")] Guid OrderId,
    [property: JsonPropertyName("orderPublicCode")] string? OrderPublicCode,
    [property: JsonPropertyName("customerName")] string? CustomerName,
    [property: JsonPropertyName("provider")] string Provider,
    [property: JsonPropertyName("providerReference")] string ProviderReference,
    [property: JsonPropertyName("method")] string Method,
    [property: JsonPropertyName("status")] string Status,
    [property: JsonPropertyName("amount")] decimal Amount,
    [property: JsonPropertyName("feeAmount")] decimal FeeAmount,
    [property: JsonPropertyName("netAmount")] decimal NetAmount,
    [property: JsonPropertyName("currency")] string Currency,
    [property: JsonPropertyName("failureCode")] string? FailureCode,
    [property: JsonPropertyName("paidAt")] DateTime? PaidAt,
    [property: JsonPropertyName("createdAt")] DateTime CreatedAt,
    [property: JsonPropertyName("metadata")] TransactionMetadataDto? Metadata,
    [property: JsonPropertyName("refunds")] IReadOnlyList<RefundDto> Refunds
);

public record CreateRefundRequest(
    [property: JsonPropertyName("amount")] decimal? Amount,
    [property: JsonPropertyName("reason")] string? Reason,
    [property: JsonPropertyName("idempotencyKey")] string? IdempotencyKey
);
