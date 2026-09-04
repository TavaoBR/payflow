namespace PayFlow.Domain.Entities;

using PayFlow.Domain.Common;
using PayFlow.Domain.Enums;

public class CheckoutBranding : BaseEntity, ITenantScoped
{
    public Guid TenantId { get; set; }
    public Tenant? Tenant { get; set; }

    public string? LogoUrl { get; set; }
    public string PrimaryColor { get; set; } = "#2563eb";
    public string SecondaryColor { get; set; } = "#0f172a";
    public string FontFamily { get; set; } = "Geist";
    public string RadiusPreset { get; set; } = "rounded-lg";
    public string CtaText { get; set; } = "Finalizar Pagamento";
    public string SuccessTitle { get; set; } = "Pagamento Confirmado!";
    public string SuccessMessage { get; set; } = "Obrigado por sua compra. Enviamos a confirmação para o seu e-mail.";
    public string? RedirectUrl { get; set; }
    public int RedirectDelaySeconds { get; set; } = 5;
}

public class WebhookEndpoint : BaseEntity, ITenantScoped
{
    public Guid TenantId { get; set; }
    public Tenant? Tenant { get; set; }

    public string Url { get; set; } = string.Empty;
    public string SecretEncrypted { get; set; } = string.Empty;
    public WebhookEndpointStatus Status { get; set; } = WebhookEndpointStatus.Active;
    public string SubscribedEvents { get; set; } = "*";

    public ICollection<WebhookDelivery> Deliveries { get; set; } = new List<WebhookDelivery>();
}

public class WebhookEvent : BaseEntity, ITenantScoped
{
    public Guid TenantId { get; set; }
    public Tenant? Tenant { get; set; }

    public string EventType { get; set; } = string.Empty;
    public string AggregateType { get; set; } = string.Empty;
    public Guid AggregateId { get; set; }
    public string PayloadJson { get; set; } = "{}";

    public ICollection<WebhookDelivery> Deliveries { get; set; } = new List<WebhookDelivery>();
}

public class WebhookDelivery : BaseEntity
{
    public Guid EventId { get; set; }
    public WebhookEvent? Event { get; set; }

    public Guid EndpointId { get; set; }
    public WebhookEndpoint? Endpoint { get; set; }

    public int Attempt { get; set; } = 1;
    public WebhookDeliveryStatus Status { get; set; } = WebhookDeliveryStatus.Pending;
    public int? ResponseCode { get; set; }
    public DateTime? NextRetryAt { get; set; }
    public DateTime? DeliveredAt { get; set; }
    public string? LastErrorSanitized { get; set; }
}

public class AuditEntry : BaseEntity, ITenantScoped
{
    public Guid TenantId { get; set; }
    public Tenant? Tenant { get; set; }

    public Guid? ActorUserId { get; set; }
    public string Action { get; set; } = string.Empty;
    public string EntityType { get; set; } = string.Empty;
    public Guid? EntityId { get; set; }
    public string CorrelationId { get; set; } = string.Empty;
    public string MetadataJson { get; set; } = "{}";
}

public class IdempotencyRecord : BaseEntity, ITenantScoped
{
    public Guid TenantId { get; set; }
    public Tenant? Tenant { get; set; }

    public string Key { get; set; } = string.Empty;
    public string RouteScope { get; set; } = string.Empty;
    public string RequestHash { get; set; } = string.Empty;
    public int ResponseStatus { get; set; }
    public string ResponseBodyJson { get; set; } = "{}";
    public DateTime ExpiresAt { get; set; }
}
