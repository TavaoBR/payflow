namespace PayFlow.Domain.Entities;

using PayFlow.Domain.Common;
using PayFlow.Domain.Enums;
using PayFlow.Domain.ValueObjects;

public class Order : BaseEntity, ITenantScoped, IAggregateRoot
{
    public Guid TenantId { get; set; }
    public Tenant? Tenant { get; set; }

    public Guid? CustomerId { get; set; }
    public Customer? Customer { get; set; }

    public string PublicCode { get; set; } = string.Empty;
    public OrderStatus Status { get; set; } = OrderStatus.Draft;
    public string Currency { get; set; } = Money.DefaultCurrency;

    public decimal SubtotalAmount { get; set; }
    public decimal DiscountAmount { get; set; }
    public decimal TotalAmount { get; set; }

    public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
    public ICollection<PaymentTransaction> Transactions { get; set; } = new List<PaymentTransaction>();

    public void AddItem(Guid? productId, string description, int quantity, decimal unitAmount)
    {
        if (quantity <= 0) throw new ArgumentOutOfRangeException(nameof(quantity), "Quantity must be positive.");
        if (unitAmount < 0) throw new ArgumentOutOfRangeException(nameof(unitAmount), "Unit amount cannot be negative.");

        var item = new OrderItem
        {
            OrderId = Id,
            ProductId = productId,
            DescriptionSnapshot = description,
            Quantity = quantity,
            UnitAmount = unitAmount,
            TotalAmount = quantity * unitAmount
        };

        Items.Add(item);
        RecalculateTotals();
    }

    public void ApplyDiscount(decimal discount)
    {
        if (discount < 0) throw new ArgumentOutOfRangeException(nameof(discount), "Discount cannot be negative.");
        DiscountAmount = Math.Min(SubtotalAmount, discount);
        RecalculateTotals();
    }

    public void RecalculateTotals()
    {
        SubtotalAmount = Items.Sum(i => i.TotalAmount);
        TotalAmount = Math.Max(0m, SubtotalAmount - DiscountAmount);
    }
}

public class OrderItem : BaseEntity
{
    public Guid OrderId { get; set; }
    public Order? Order { get; set; }

    public Guid? ProductId { get; set; }
    public Product? Product { get; set; }

    public string DescriptionSnapshot { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal UnitAmount { get; set; }
    public decimal TotalAmount { get; set; }
}
