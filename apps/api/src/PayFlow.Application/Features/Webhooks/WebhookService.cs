using PayFlow.Application.Abstractions;
using PayFlow.Application.Exceptions;
using PayFlow.Contracts.Webhooks;
using PayFlow.Domain.Entities;
using PayFlow.Domain.Enums;

namespace PayFlow.Application.Features.Webhooks;

public interface IWebhookService
{
    Task<IReadOnlyList<WebhookEndpointDto>> GetEndpointsAsync(CancellationToken ct = default);
    Task<WebhookEndpointCreatedDto> CreateEndpointAsync(CreateWebhookEndpointRequest request, CancellationToken ct = default);
    Task<WebhookEndpointDto> UpdateEndpointAsync(Guid id, UpdateWebhookEndpointRequest request, CancellationToken ct = default);
    Task DeleteEndpointAsync(Guid id, CancellationToken ct = default);
}

public class WebhookService : IWebhookService
{
    private readonly IWebhookRepository _webhookRepository;
    private readonly ITenantContext _tenantContext;
    private readonly IAuditService _auditService;

    public WebhookService(
        IWebhookRepository webhookRepository,
        ITenantContext tenantContext,
        IAuditService auditService)
    {
        _webhookRepository = webhookRepository;
        _tenantContext = tenantContext;
        _auditService = auditService;
    }

    public async Task<IReadOnlyList<WebhookEndpointDto>> GetEndpointsAsync(CancellationToken ct = default)
    {
        var endpoints = await _webhookRepository.GetEndpointsAsync(ct);
        return endpoints.Select(MapToDto).ToList();
    }

    public async Task<WebhookEndpointCreatedDto> CreateEndpointAsync(CreateWebhookEndpointRequest request, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(request.Url) || !Uri.TryCreate(request.Url, UriKind.Absolute, out _))
            throw new ValidationException("url", "webhook.invalid_url", "URL do webhook inválida.");

        var tenantId = _tenantContext.CurrentTenantId ?? throw new UnauthorizedException("Tenant não identificado.");

        var secret = $"whsec_{Guid.NewGuid():N}";
        var events = request.SubscribedEvents != null && request.SubscribedEvents.Any()
            ? string.Join(",", request.SubscribedEvents)
            : "*";

        var endpoint = new WebhookEndpoint
        {
            TenantId = tenantId,
            Url = request.Url.Trim(),
            SecretEncrypted = secret, // In production, can be encrypted with key
            Status = WebhookEndpointStatus.Active,
            SubscribedEvents = events
        };

        await _webhookRepository.AddEndpointAsync(endpoint, ct);
        await _webhookRepository.SaveChangesAsync(ct);

        await _auditService.LogAsync("webhook_endpoint.create", "WebhookEndpoint", endpoint.Id, new { endpoint.Url }, ct);

        var subscribed = endpoint.SubscribedEvents.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
        return new WebhookEndpointCreatedDto(
            endpoint.Id,
            endpoint.Url,
            secret,
            endpoint.Status.ToString().ToLowerInvariant(),
            subscribed,
            endpoint.CreatedAt
        );
    }

    public async Task<WebhookEndpointDto> UpdateEndpointAsync(Guid id, UpdateWebhookEndpointRequest request, CancellationToken ct = default)
    {
        var endpoint = await _webhookRepository.GetEndpointByIdAsync(id, ct);
        if (endpoint == null)
            throw new NotFoundException("WebhookEndpoint", id);

        if (!string.IsNullOrWhiteSpace(request.Url))
        {
            if (!Uri.TryCreate(request.Url, UriKind.Absolute, out _))
                throw new ValidationException("url", "webhook.invalid_url", "URL do webhook inválida.");
            endpoint.Url = request.Url.Trim();
        }

        if (!string.IsNullOrWhiteSpace(request.Status) && Enum.TryParse<WebhookEndpointStatus>(request.Status, true, out var status))
            endpoint.Status = status;

        if (request.SubscribedEvents != null && request.SubscribedEvents.Any())
            endpoint.SubscribedEvents = string.Join(",", request.SubscribedEvents);

        await _webhookRepository.UpdateEndpointAsync(endpoint, ct);
        await _webhookRepository.SaveChangesAsync(ct);

        await _auditService.LogAsync("webhook_endpoint.update", "WebhookEndpoint", endpoint.Id, new { endpoint.Url }, ct);

        return MapToDto(endpoint);
    }

    public async Task DeleteEndpointAsync(Guid id, CancellationToken ct = default)
    {
        var endpoint = await _webhookRepository.GetEndpointByIdAsync(id, ct);
        if (endpoint == null)
            throw new NotFoundException("WebhookEndpoint", id);

        await _webhookRepository.DeleteEndpointAsync(endpoint, ct);
        await _webhookRepository.SaveChangesAsync(ct);

        await _auditService.LogAsync("webhook_endpoint.delete", "WebhookEndpoint", id, new { endpoint.Url }, ct);
    }

    private static WebhookEndpointDto MapToDto(WebhookEndpoint ep)
    {
        var subscribed = ep.SubscribedEvents.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
        return new WebhookEndpointDto(
            ep.Id,
            ep.Url,
            ep.Status.ToString().ToLowerInvariant(),
            subscribed,
            ep.CreatedAt
        );
    }
}
