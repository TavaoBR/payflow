using System.Text.Json.Serialization;

namespace PayFlow.Contracts.Audit;

public record AuditEntryDto(
    [property: JsonPropertyName("id")] Guid Id,
    [property: JsonPropertyName("actorUserId")] Guid? ActorUserId,
    [property: JsonPropertyName("action")] string Action,
    [property: JsonPropertyName("entityType")] string EntityType,
    [property: JsonPropertyName("entityId")] Guid? EntityId,
    [property: JsonPropertyName("correlationId")] string CorrelationId,
    [property: JsonPropertyName("metadataJson")] string MetadataJson,
    [property: JsonPropertyName("createdAt")] DateTime CreatedAt
);
