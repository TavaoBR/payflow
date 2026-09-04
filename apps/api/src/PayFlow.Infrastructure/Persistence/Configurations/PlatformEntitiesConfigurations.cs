namespace PayFlow.Infrastructure.Persistence.Configurations;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PayFlow.Domain.Entities;

public class CheckoutBrandingConfiguration : IEntityTypeConfiguration<CheckoutBranding>
{
    public void Configure(EntityTypeBuilder<CheckoutBranding> builder)
    {
        builder.HasKey(cb => cb.Id);

        builder.Property(cb => cb.LogoUrl)
            .HasMaxLength(1000);

        builder.Property(cb => cb.PrimaryColor)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(cb => cb.SecondaryColor)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(cb => cb.FontFamily)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(cb => cb.RadiusPreset)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(cb => cb.CtaText)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(cb => cb.SuccessTitle)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(cb => cb.SuccessMessage)
            .HasMaxLength(1000);

        builder.Property(cb => cb.RedirectUrl)
            .HasMaxLength(1000);

        builder.HasIndex(cb => cb.TenantId)
            .IsUnique();

        builder.HasOne(cb => cb.Tenant)
            .WithOne(t => t.Branding)
            .HasForeignKey<CheckoutBranding>(cb => cb.TenantId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

public class WebhookEndpointConfiguration : IEntityTypeConfiguration<WebhookEndpoint>
{
    public void Configure(EntityTypeBuilder<WebhookEndpoint> builder)
    {
        builder.HasKey(we => we.Id);

        builder.Property(we => we.Url)
            .IsRequired()
            .HasMaxLength(1000);

        builder.Property(we => we.SecretEncrypted)
            .IsRequired()
            .HasMaxLength(500);

        builder.Property(we => we.SubscribedEvents)
            .IsRequired()
            .HasMaxLength(500);

        builder.HasOne(we => we.Tenant)
            .WithMany(t => t.WebhookEndpoints)
            .HasForeignKey(we => we.TenantId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

public class WebhookEventConfiguration : IEntityTypeConfiguration<WebhookEvent>
{
    public void Configure(EntityTypeBuilder<WebhookEvent> builder)
    {
        builder.HasKey(we => we.Id);

        builder.Property(we => we.EventType)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(we => we.AggregateType)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(we => we.PayloadJson)
            .HasColumnType("text");

        builder.HasOne(we => we.Tenant)
            .WithMany()
            .HasForeignKey(we => we.TenantId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

public class WebhookDeliveryConfiguration : IEntityTypeConfiguration<WebhookDelivery>
{
    public void Configure(EntityTypeBuilder<WebhookDelivery> builder)
    {
        builder.HasKey(wd => wd.Id);

        builder.Property(wd => wd.LastErrorSanitized)
            .HasMaxLength(2000);

        builder.HasOne(wd => wd.Event)
            .WithMany(e => e.Deliveries)
            .HasForeignKey(wd => wd.EventId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(wd => wd.Endpoint)
            .WithMany(ep => ep.Deliveries)
            .HasForeignKey(wd => wd.EndpointId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

public class AuditEntryConfiguration : IEntityTypeConfiguration<AuditEntry>
{
    public void Configure(EntityTypeBuilder<AuditEntry> builder)
    {
        builder.HasKey(ae => ae.Id);

        builder.Property(ae => ae.Action)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(ae => ae.EntityType)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(ae => ae.CorrelationId)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(ae => ae.MetadataJson)
            .HasColumnType("text");

        builder.HasIndex(ae => new { ae.TenantId, ae.CreatedAt });

        builder.HasOne(ae => ae.Tenant)
            .WithMany()
            .HasForeignKey(ae => ae.TenantId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

public class IdempotencyRecordConfiguration : IEntityTypeConfiguration<IdempotencyRecord>
{
    public void Configure(EntityTypeBuilder<IdempotencyRecord> builder)
    {
        builder.HasKey(ir => ir.Id);

        builder.Property(ir => ir.Key)
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(ir => ir.RouteScope)
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(ir => ir.RequestHash)
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(ir => ir.ResponseBodyJson)
            .HasColumnType("text");

        builder.HasIndex(ir => new { ir.TenantId, ir.Key, ir.RouteScope })
            .IsUnique();

        builder.HasOne(ir => ir.Tenant)
            .WithMany()
            .HasForeignKey(ir => ir.TenantId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
