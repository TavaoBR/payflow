using System.Text.Json.Serialization;

namespace PayFlow.Contracts.Webhooks;

public record WebhookEndpointDto(
    [property: JsonPropertyName("id")] Guid Id,
    [property: JsonPropertyName("url")] string Url,
    [property: JsonPropertyName("status")] string Status,
    [property: JsonPropertyName("subscribedEvents")] IReadOnlyList<string> SubscribedEvents,
    [property: JsonPropertyName("createdAt")] DateTime CreatedAt
);

public record CreateWebhookEndpointRequest(
    [property: JsonPropertyName("url")] string Url,
    [property: JsonPropertyName("subscribedEvents")] IReadOnlyList<string> SubscribedEvents
);

public record UpdateWebhookEndpointRequest(
    [property: JsonPropertyName("url")] string Url,
    [property: JsonPropertyName("status")] string? Status,
    [property: JsonPropertyName("subscribedEvents")] IReadOnlyList<string>? SubscribedEvents
);

public record WebhookEndpointCreatedDto(
    [property: JsonPropertyName("id")] Guid Id,
    [property: JsonPropertyName("url")] string Url,
    [property: JsonPropertyName("secret")] string Secret,
    [property: JsonPropertyName("status")] string Status,
    [property: JsonPropertyName("subscribedEvents")] IReadOnlyList<string> SubscribedEvents,
    [property: JsonPropertyName("createdAt")] DateTime CreatedAt
);
