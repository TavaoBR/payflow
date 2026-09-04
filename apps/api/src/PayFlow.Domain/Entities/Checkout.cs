namespace PayFlow.Domain.Entities;

using PayFlow.Domain.Common;
using PayFlow.Domain.Enums;
using PayFlow.Domain.ValueObjects;

public class PaymentLink : BaseEntity, ITenantScoped, IAggregateRoot
{
    public Guid TenantId { get; set; }
    public Tenant? Tenant { get; set; }

    public string PublicToken { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }

    public Guid? ProductId { get; set; }
    public Product? Product { get; set; }

    public decimal? FixedAmount { get; set; }
    public string Currency { get; set; } = Money.DefaultCurrency;
    public string AllowedMethods { get; set; } = "Pix,CreditCard,Boleto";
    public decimal PixDiscountPct { get; set; } = 0m;
    public int MaxInstallments { get; set; } = 12;
    public DateTime? ExpiresAt { get; set; }
    public PaymentLinkStatus Status { get; set; } = PaymentLinkStatus.Active;

    public ICollection<CheckoutSession> Sessions { get; set; } = new List<CheckoutSession>();
}

public class CheckoutSession : BaseEntity, ITenantScoped, IAggregateRoot
{
    public Guid TenantId { get; set; }
    public Tenant? Tenant { get; set; }

    public Guid? PaymentLinkId { get; set; }
    public PaymentLink? PaymentLink { get; set; }

    public Guid? OrderId { get; set; }
    public Order? Order { get; set; }

    public string PublicToken { get; set; } = string.Empty;
    public CheckoutSessionStatus Status { get; set; } = CheckoutSessionStatus.Active;
    public DateTime ExpiresAt { get; set; }
    public string? CustomerSnapshotJson { get; set; }

    public ICollection<PaymentTransaction> Transactions { get; set; } = new List<PaymentTransaction>();
}
