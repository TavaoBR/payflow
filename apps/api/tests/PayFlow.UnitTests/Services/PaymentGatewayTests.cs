using PayFlow.Contracts.PublicCheckout;
using PayFlow.Domain.Entities;
using PayFlow.Domain.Enums;
using PayFlow.Infrastructure.Payments;
using Xunit;

namespace PayFlow.UnitTests.Services;

public class PaymentGatewayTests
{
    private readonly MockPaymentGateway _gateway = new();

    [Fact]
    public async Task ProcessPix_Should_Return_Pending_And_QrCode()
    {
        var tx = new PaymentTransaction
        {
            Id = Guid.NewGuid(),
            Amount = 150.00m,
            Method = PaymentMethod.Pix,
            Status = TransactionStatus.Pending
        };

        var result = await _gateway.ProcessPixAsync(tx);

        Assert.True(result.Success);
        Assert.Equal(TransactionStatus.Pending, result.Status);
        Assert.NotNull(result.PixQrCode);
        Assert.NotNull(result.PixQrCodeUrl);
        Assert.True(result.PixExpiration > DateTime.UtcNow);
    }

    [Theory]
    [InlineData("4111111111111234", "Visa", true, TransactionStatus.Paid, null)]
    [InlineData("5500000000000000", "Mastercard", false, TransactionStatus.Failed, "CARD_DECLINED")]
    [InlineData("6062820000005100", "Elo", false, TransactionStatus.Failed, "INSUFFICIENT_FUNDS")]
    [InlineData("4000000000009999", "Visa", false, TransactionStatus.Failed, "EXPIRED_CARD")]
    public async Task ProcessCard_Should_Simulate_Deterministic_Scenarios(
        string cardNumber,
        string expectedBrand,
        bool expectedSuccess,
        TransactionStatus expectedStatus,
        string? expectedReason)
    {
        var tx = new PaymentTransaction
        {
            Id = Guid.NewGuid(),
            Amount = 250.00m,
            Method = PaymentMethod.CreditCard,
            Status = TransactionStatus.Processing
        };

        var request = new CardPaymentRequest(
            HolderName: "Test Cardholder",
            CardNumber: cardNumber,
            Expiration: "12/28",
            Cvv: "123",
            Installments: 1
        );

        var result = await _gateway.ProcessCardAsync(tx, request);

        Assert.Equal(expectedSuccess, result.Success);
        Assert.Equal(expectedStatus, result.Status);
        Assert.Equal(expectedBrand, result.CardBrand);
        Assert.Equal(expectedReason, result.FailureReason);
    }

    [Fact]
    public async Task ProcessBoleto_Should_Return_Barcode_And_DueDate()
    {
        var tx = new PaymentTransaction
        {
            Id = Guid.NewGuid(),
            Amount = 89.90m,
            Method = PaymentMethod.Boleto,
            Status = TransactionStatus.Pending
        };

        var result = await _gateway.ProcessBoletoAsync(tx);

        Assert.True(result.Success);
        Assert.Equal(TransactionStatus.Pending, result.Status);
        Assert.NotNull(result.BoletoBarcode);
        Assert.NotNull(result.BoletoUrl);
        Assert.True(result.BoletoDueDate > DateTime.UtcNow);
    }
}
