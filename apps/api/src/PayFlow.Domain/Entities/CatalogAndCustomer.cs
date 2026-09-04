namespace PayFlow.Domain.Entities;

using PayFlow.Domain.Common;
using PayFlow.Domain.Enums;
using PayFlow.Domain.ValueObjects;

public class Product : BaseEntity, ITenantScoped, IAggregateRoot
{
    public Guid TenantId { get; set; }
    public Tenant? Tenant { get; set; }

    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Sku { get; set; } = string.Empty;
    public ProductType Type { get; set; } = ProductType.Digital;
    public string? Description { get; set; }
    public decimal PriceAmount { get; set; }
    public string Currency { get; set; } = Money.DefaultCurrency;
    public ProductStatus Status { get; set; } = ProductStatus.Active;
    public string StockMode { get; set; } = "Unlimited";
    public int StockQuantity { get; set; } = 0;
    public string? ImageUrl { get; set; }

    public Money Price => new(PriceAmount, Currency);
}

public class Customer : BaseEntity, ITenantScoped, IAggregateRoot
{
    public Guid TenantId { get; set; }
    public Tenant? Tenant { get; set; }

    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string? DocumentHash { get; set; }
    public string? DocumentLast4 { get; set; }
    public CustomerStatus Status { get; set; } = CustomerStatus.Active;

    public ICollection<Order> Orders { get; set; } = new List<Order>();
}
