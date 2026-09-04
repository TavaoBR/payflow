namespace PayFlow.Infrastructure.Persistence.Configurations;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PayFlow.Domain.Entities;

public class PaymentLinkConfiguration : IEntityTypeConfiguration<PaymentLink>
{
    public void Configure(EntityTypeBuilder<PaymentLink> builder)
    {
        builder.HasKey(pl => pl.Id);

        builder.Property(pl => pl.PublicToken)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(pl => pl.Title)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(pl => pl.Description)
            .HasMaxLength(2000);

        builder.Property(pl => pl.FixedAmount)
            .HasPrecision(19, 4);

        builder.Property(pl => pl.Currency)
            .IsRequired()
            .HasMaxLength(3);

        builder.Property(pl => pl.AllowedMethods)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(pl => pl.PixDiscountPct)
            .HasPrecision(5, 2);

        builder.HasIndex(pl => pl.PublicToken)
            .IsUnique();

        builder.HasOne(pl => pl.Tenant)
            .WithMany(t => t.PaymentLinks)
            .HasForeignKey(pl => pl.TenantId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(pl => pl.Product)
            .WithMany()
            .HasForeignKey(pl => pl.ProductId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}

public class CheckoutSessionConfiguration : IEntityTypeConfiguration<CheckoutSession>
{
    public void Configure(EntityTypeBuilder<CheckoutSession> builder)
    {
        builder.HasKey(cs => cs.Id);

        builder.Property(cs => cs.PublicToken)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(cs => cs.CustomerSnapshotJson)
            .HasColumnType("text");

        builder.HasIndex(cs => cs.PublicToken)
            .IsUnique();

        builder.HasOne(cs => cs.Tenant)
            .WithMany()
            .HasForeignKey(cs => cs.TenantId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(cs => cs.PaymentLink)
            .WithMany(pl => pl.Sessions)
            .HasForeignKey(cs => cs.PaymentLinkId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasOne(cs => cs.Order)
            .WithMany()
            .HasForeignKey(cs => cs.OrderId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
