using Microsoft.EntityFrameworkCore;
using PayFlow.Application.Abstractions;
using PayFlow.Domain.Entities;
using PayFlow.Infrastructure.Persistence;

namespace PayFlow.Infrastructure.Repositories;

public class WebhookRepository : IWebhookRepository
{
    private readonly PayFlowDbContext _dbContext;

    public WebhookRepository(PayFlowDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IReadOnlyList<WebhookEndpoint>> GetEndpointsAsync(CancellationToken ct = default)
    {
        return await _dbContext.WebhookEndpoints
            .OrderByDescending(e => e.CreatedAt)
            .ToListAsync(ct);
    }

    public async Task<WebhookEndpoint?> GetEndpointByIdAsync(Guid id, CancellationToken ct = default)
    {
        return await _dbContext.WebhookEndpoints.FirstOrDefaultAsync(e => e.Id == id, ct);
    }

    public async Task AddEndpointAsync(WebhookEndpoint endpoint, CancellationToken ct = default)
    {
        await _dbContext.WebhookEndpoints.AddAsync(endpoint, ct);
    }

    public Task UpdateEndpointAsync(WebhookEndpoint endpoint, CancellationToken ct = default)
    {
        _dbContext.WebhookEndpoints.Update(endpoint);
        return Task.CompletedTask;
    }

    public Task DeleteEndpointAsync(WebhookEndpoint endpoint, CancellationToken ct = default)
    {
        _dbContext.WebhookEndpoints.Remove(endpoint);
        return Task.CompletedTask;
    }

    public async Task AddEventAsync(WebhookEvent evt, CancellationToken ct = default)
    {
        await _dbContext.WebhookEvents.AddAsync(evt, ct);
    }

    public Task SaveChangesAsync(CancellationToken ct = default)
    {
        return _dbContext.SaveChangesAsync(ct);
    }
}
