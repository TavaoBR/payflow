namespace PayFlow.Domain.Entities;

using PayFlow.Domain.Common;
using PayFlow.Domain.Enums;
using PayFlow.Domain.ValueObjects;

public class PaymentTransaction : BaseEntity, ITenantScoped, IAggregateRoot
{
    public Guid TenantId { get; set; }
    public Tenant? Tenant { get; set; }

    public Guid OrderId { get; set; }
    public Order? Order { get; set; }

    public Guid? CheckoutSessionId { get; set; }
    public CheckoutSession? CheckoutSession { get; set; }

    public string Provider { get; set; } = "MockProvider";
    public string ProviderReference { get; set; } = string.Empty;
    public PaymentMethod Method { get; set; }
    public TransactionStatus Status { get; set; } = TransactionStatus.Pending;

    public decimal Amount { get; set; }
    public decimal FeeAmount { get; set; }
    public decimal NetAmount { get; set; }
    public string Currency { get; set; } = Money.DefaultCurrency;

    public string IdempotencyKey { get; set; } = string.Empty;
    public string? FailureCode { get; set; }
    public DateTime? PaidAt { get; set; }

    public PaymentMethodMetadata? Metadata { get; set; }
    public ICollection<Refund> Refunds { get; set; } = new List<Refund>();
}

public class PaymentMethodMetadata : BaseEntity
{
    public Guid PaymentTransactionId { get; set; }
    public PaymentTransaction? Transaction { get; set; }

    public string? Brand { get; set; }
    public string? Last4 { get; set; }
    public int? Installments { get; set; }
    public DateTime? PixExpiration { get; set; }
    public string? PixQrCode { get; set; }
    public string? PixQrCodeUrl { get; set; }
    public DateTime? BoletoDueDate { get; set; }
    public string? BoletoBarcode { get; set; }
    public string? BoletoUrl { get; set; }
}

public class Refund : BaseEntity, ITenantScoped
{
    public Guid TenantId { get; set; }
    public Tenant? Tenant { get; set; }

    public Guid PaymentTransactionId { get; set; }
    public PaymentTransaction? Transaction { get; set; }

    public decimal Amount { get; set; }
    public RefundStatus Status { get; set; } = RefundStatus.Pending;
    public string Reason { get; set; } = string.Empty;
    public string IdempotencyKey { get; set; } = string.Empty;
    public DateTime? ProcessedAt { get; set; }
}
