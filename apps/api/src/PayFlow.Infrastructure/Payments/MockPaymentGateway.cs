using PayFlow.Application.Abstractions;
using PayFlow.Contracts.PublicCheckout;
using PayFlow.Domain.Entities;
using PayFlow.Domain.Enums;

namespace PayFlow.Infrastructure.Payments;

public class MockPaymentGateway : IPaymentGateway
{
    public Task<PaymentGatewayResult> ProcessPixAsync(PaymentTransaction transaction, CancellationToken ct = default)
    {
        var expiration = DateTime.UtcNow.AddMinutes(15);
        var refId = $"PIX-{Guid.NewGuid():N}";
        var qrCodePayload = $"00020126580014br.gov.bcb.pix0136{Guid.NewGuid():D}520400005303986540{transaction.Amount:F2}5802BR5912PAYFLOW6009SAO PAULO62070503***6304ABCD";
        var qrCodeUrl = $"https://api.qrserver.com/v1/create-qr-code/?size=250x250&data={Uri.EscapeDataString(qrCodePayload)}";

        return Task.FromResult(new PaymentGatewayResult(
            Success: true,
            Status: TransactionStatus.Pending,
            ProviderReference: refId,
            PixQrCode: qrCodePayload,
            PixQrCodeUrl: qrCodeUrl,
            PixExpiration: expiration
        ));
    }

    public Task<PaymentGatewayResult> ProcessCardAsync(PaymentTransaction transaction, CardPaymentRequest cardRequest, CancellationToken ct = default)
    {
        var cleanCardNumber = cardRequest.CardNumber.Replace(" ", "").Replace("-", "");
        var last4 = cleanCardNumber.Length >= 4 ? cleanCardNumber[^4..] : "1234";
        var brand = DetectCardBrand(cleanCardNumber);
        var refId = $"CARD-{Guid.NewGuid():N}";

        if (last4 == "0000")
        {
            return Task.FromResult(new PaymentGatewayResult(
                Success: false,
                Status: TransactionStatus.Failed,
                ProviderReference: refId,
                FailureReason: "CARD_DECLINED",
                CardBrand: brand,
                CardLast4: last4
            ));
        }

        if (last4 == "5100")
        {
            return Task.FromResult(new PaymentGatewayResult(
                Success: false,
                Status: TransactionStatus.Failed,
                ProviderReference: refId,
                FailureReason: "INSUFFICIENT_FUNDS",
                CardBrand: brand,
                CardLast4: last4
            ));
        }

        if (last4 == "9999")
        {
            return Task.FromResult(new PaymentGatewayResult(
                Success: false,
                Status: TransactionStatus.Failed,
                ProviderReference: refId,
                FailureReason: "EXPIRED_CARD",
                CardBrand: brand,
                CardLast4: last4
            ));
        }

        return Task.FromResult(new PaymentGatewayResult(
            Success: true,
            Status: TransactionStatus.Paid,
            ProviderReference: refId,
            CardBrand: brand,
            CardLast4: last4
        ));
    }

    public Task<PaymentGatewayResult> ProcessBoletoAsync(PaymentTransaction transaction, CancellationToken ct = default)
    {
        var dueDate = DateTime.UtcNow.AddDays(3);
        var refId = $"BOL-{Guid.NewGuid():N}";
        var barcode = $"34191.79001 01043.510047 91020.150008 5 {dueDate:yyMMdd}{transaction.Amount * 100:0000000000}";
        var boletoUrl = $"https://sandbox.payflow.local/boletos/{refId}.pdf";

        return Task.FromResult(new PaymentGatewayResult(
            Success: true,
            Status: TransactionStatus.Pending,
            ProviderReference: refId,
            BoletoBarcode: barcode,
            BoletoUrl: boletoUrl,
            BoletoDueDate: dueDate
        ));
    }

    public Task<RefundGatewayResult> ProcessRefundAsync(PaymentTransaction transaction, decimal amount, string reason, CancellationToken ct = default)
    {
        return Task.FromResult(new RefundGatewayResult(
            Success: true,
            Status: RefundStatus.Approved
        ));
    }

    private static string DetectCardBrand(string cardNumber)
    {
        if (cardNumber.StartsWith('4')) return "Visa";
        if (cardNumber.StartsWith('5')) return "Mastercard";
        if (cardNumber.StartsWith('6')) return "Elo";
        if (cardNumber.StartsWith("34") || cardNumber.StartsWith("37")) return "Amex";
        return "Unknown";
    }
}
