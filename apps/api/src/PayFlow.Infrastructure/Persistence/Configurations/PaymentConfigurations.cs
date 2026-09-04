namespace PayFlow.Infrastructure.Persistence.Configurations;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PayFlow.Domain.Entities;

public class PaymentTransactionConfiguration : IEntityTypeConfiguration<PaymentTransaction>
{
    public void Configure(EntityTypeBuilder<PaymentTransaction> builder)
    {
        builder.HasKey(pt => pt.Id);

        builder.Property(pt => pt.Provider)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(pt => pt.ProviderReference)
            .HasMaxLength(255);

        builder.Property(pt => pt.Amount)
            .HasPrecision(19, 4);

        builder.Property(pt => pt.FeeAmount)
            .HasPrecision(19, 4);

        builder.Property(pt => pt.NetAmount)
            .HasPrecision(19, 4);

        builder.Property(pt => pt.Currency)
            .IsRequired()
            .HasMaxLength(3);

        builder.Property(pt => pt.IdempotencyKey)
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(pt => pt.FailureCode)
            .HasMaxLength(50);

        builder.HasIndex(pt => new { pt.TenantId, pt.IdempotencyKey });

        builder.HasOne(pt => pt.Tenant)
            .WithMany()
            .HasForeignKey(pt => pt.TenantId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(pt => pt.Order)
            .WithMany(o => o.Transactions)
            .HasForeignKey(pt => pt.OrderId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(pt => pt.CheckoutSession)
            .WithMany(cs => cs.Transactions)
            .HasForeignKey(pt => pt.CheckoutSessionId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasOne(pt => pt.Metadata)
            .WithOne(m => m.Transaction)
            .HasForeignKey<PaymentMethodMetadata>(m => m.PaymentTransactionId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

public class PaymentMethodMetadataConfiguration : IEntityTypeConfiguration<PaymentMethodMetadata>
{
    public void Configure(EntityTypeBuilder<PaymentMethodMetadata> builder)
    {
        builder.HasKey(m => m.Id);

        builder.Property(m => m.Brand)
            .HasMaxLength(50);

        builder.Property(m => m.Last4)
            .HasMaxLength(4);

        builder.Property(m => m.PixQrCode)
            .HasColumnType("text");

        builder.Property(m => m.PixQrCodeUrl)
            .HasMaxLength(1000);

        builder.Property(m => m.BoletoBarcode)
            .HasMaxLength(100);

        builder.Property(m => m.BoletoUrl)
            .HasMaxLength(1000);
    }
}

public class RefundConfiguration : IEntityTypeConfiguration<Refund>
{
    public void Configure(EntityTypeBuilder<Refund> builder)
    {
        builder.HasKey(r => r.Id);

        builder.Property(r => r.Amount)
            .HasPrecision(19, 4);

        builder.Property(r => r.Reason)
            .HasMaxLength(255);

        builder.Property(r => r.IdempotencyKey)
            .IsRequired()
            .HasMaxLength(255);

        builder.HasIndex(r => new { r.TenantId, r.IdempotencyKey });

        builder.HasOne(r => r.Tenant)
            .WithMany()
            .HasForeignKey(r => r.TenantId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(r => r.Transaction)
            .WithMany(pt => pt.Refunds)
            .HasForeignKey(r => r.PaymentTransactionId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
