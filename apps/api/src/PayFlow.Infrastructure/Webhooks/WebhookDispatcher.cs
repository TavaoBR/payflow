using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using PayFlow.Application.Abstractions;
using PayFlow.Domain.Entities;
using PayFlow.Domain.Enums;
using PayFlow.Infrastructure.Persistence;

namespace PayFlow.Infrastructure.Webhooks;

public class WebhookDispatcher : IWebhookDispatcher
{
    private readonly PayFlowDbContext _dbContext;

    public WebhookDispatcher(PayFlowDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task DispatchEventAsync(Guid tenantId, string eventType, string aggregateType, Guid aggregateId, object payload, CancellationToken ct = default)
    {
        var payloadJson = JsonSerializer.Serialize(payload);

        var evt = new WebhookEvent
        {
            TenantId = tenantId,
            EventType = eventType,
            AggregateType = aggregateType,
            AggregateId = aggregateId,
            PayloadJson = payloadJson
        };

        _dbContext.WebhookEvents.Add(evt);

        var endpoints = await _dbContext.WebhookEndpoints
            .IgnoreQueryFilters()
            .Where(ep => ep.TenantId == tenantId && ep.Status == WebhookEndpointStatus.Active)
            .ToListAsync(ct);

        foreach (var endpoint in endpoints)
        {
            var isSubscribed = endpoint.SubscribedEvents == "*"
                               || endpoint.SubscribedEvents.Split(',').Select(e => e.Trim()).Contains(eventType);

            if (isSubscribed)
            {
                var delivery = new WebhookDelivery
                {
                    EventId = evt.Id,
                    Event = evt,
                    EndpointId = endpoint.Id,
                    Endpoint = endpoint,
                    Attempt = 1,
                    Status = WebhookDeliveryStatus.Pending,
                    NextRetryAt = DateTime.UtcNow
                };

                _dbContext.WebhookDeliveries.Add(delivery);
            }
        }

        await _dbContext.SaveChangesAsync(ct);
    }
}
