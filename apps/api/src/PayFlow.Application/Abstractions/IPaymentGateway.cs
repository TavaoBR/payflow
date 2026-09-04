using PayFlow.Contracts.PublicCheckout;
using PayFlow.Domain.Entities;
using PayFlow.Domain.Enums;

namespace PayFlow.Application.Abstractions;

public record PaymentGatewayResult(
    bool Success,
    TransactionStatus Status,
    string ProviderReference,
    string? FailureReason = null,
    string? PixQrCode = null,
    string? PixQrCodeUrl = null,
    DateTime? PixExpiration = null,
    string? BoletoBarcode = null,
    string? BoletoUrl = null,
    DateTime? BoletoDueDate = null,
    string? CardBrand = null,
    string? CardLast4 = null
);

public record RefundGatewayResult(
    bool Success,
    RefundStatus Status,
    string? FailureReason = null
);

public interface IPaymentGateway
{
    Task<PaymentGatewayResult> ProcessPixAsync(PaymentTransaction transaction, CancellationToken ct = default);
    Task<PaymentGatewayResult> ProcessCardAsync(PaymentTransaction transaction, CardPaymentRequest cardRequest, CancellationToken ct = default);
    Task<PaymentGatewayResult> ProcessBoletoAsync(PaymentTransaction transaction, CancellationToken ct = default);
    Task<RefundGatewayResult> ProcessRefundAsync(PaymentTransaction transaction, decimal amount, string reason, CancellationToken ct = default);
}
