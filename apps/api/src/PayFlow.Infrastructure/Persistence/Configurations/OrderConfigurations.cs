namespace PayFlow.Infrastructure.Persistence.Configurations;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PayFlow.Domain.Entities;

public class OrderConfiguration : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        builder.HasKey(o => o.Id);

        builder.Property(o => o.PublicCode)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(o => o.Currency)
            .IsRequired()
            .HasMaxLength(3);

        builder.Property(o => o.SubtotalAmount)
            .HasPrecision(19, 4);

        builder.Property(o => o.DiscountAmount)
            .HasPrecision(19, 4);

        builder.Property(o => o.TotalAmount)
            .HasPrecision(19, 4);

        builder.HasIndex(o => new { o.TenantId, o.PublicCode })
            .IsUnique();

        builder.HasOne(o => o.Tenant)
            .WithMany(t => t.Orders)
            .HasForeignKey(o => o.TenantId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(o => o.Customer)
            .WithMany(c => c.Orders)
            .HasForeignKey(o => o.CustomerId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}

public class OrderItemConfiguration : IEntityTypeConfiguration<OrderItem>
{
    public void Configure(EntityTypeBuilder<OrderItem> builder)
    {
        builder.HasKey(oi => oi.Id);

        builder.Property(oi => oi.DescriptionSnapshot)
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(oi => oi.UnitAmount)
            .HasPrecision(19, 4);

        builder.Property(oi => oi.TotalAmount)
            .HasPrecision(19, 4);

        builder.HasOne(oi => oi.Order)
            .WithMany(o => o.Items)
            .HasForeignKey(oi => oi.OrderId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(oi => oi.Product)
            .WithMany()
            .HasForeignKey(oi => oi.ProductId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
