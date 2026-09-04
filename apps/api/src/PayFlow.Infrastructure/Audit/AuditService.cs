using System.Text.Json;
using Microsoft.AspNetCore.Http;
using PayFlow.Application.Abstractions;
using PayFlow.Domain.Entities;
using PayFlow.Infrastructure.Persistence;

namespace PayFlow.Infrastructure.Audit;

public class AuditService : IAuditService
{
    private readonly PayFlowDbContext _dbContext;
    private readonly ITenantContext _tenantContext;
    private readonly ICurrentUser _currentUser;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public AuditService(
        PayFlowDbContext dbContext,
        ITenantContext tenantContext,
        ICurrentUser currentUser,
        IHttpContextAccessor httpContextAccessor)
    {
        _dbContext = dbContext;
        _tenantContext = tenantContext;
        _currentUser = currentUser;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task LogAsync(string action, string entityType, Guid? entityId, object? metadata = null, CancellationToken ct = default)
    {
        var tenantId = _tenantContext.CurrentTenantId;
        if (!tenantId.HasValue) return;

        var correlationId = _httpContextAccessor.HttpContext?.Response.Headers["X-Correlation-ID"].FirstOrDefault()
                            ?? _httpContextAccessor.HttpContext?.Request.Headers["X-Correlation-ID"].FirstOrDefault()
                            ?? Guid.NewGuid().ToString();

        var sanitizedMetadataJson = "{}";
        if (metadata != null)
        {
            try
            {
                sanitizedMetadataJson = JsonSerializer.Serialize(metadata);
            }
            catch
            {
                sanitizedMetadataJson = "{}";
            }
        }

        var entry = new AuditEntry
        {
            TenantId = tenantId.Value,
            ActorUserId = _currentUser.UserId,
            Action = action,
            EntityType = entityType,
            EntityId = entityId,
            CorrelationId = correlationId,
            MetadataJson = sanitizedMetadataJson
        };

        _dbContext.AuditEntries.Add(entry);
        await _dbContext.SaveChangesAsync(ct);
    }
}
