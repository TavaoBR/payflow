namespace PayFlow.Application.Abstractions;

public interface IWebhookDispatcher
{
    Task DispatchEventAsync(Guid tenantId, string eventType, string aggregateType, Guid aggregateId, object payload, CancellationToken ct = default);
}
