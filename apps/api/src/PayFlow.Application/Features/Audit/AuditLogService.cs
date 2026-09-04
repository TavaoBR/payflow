using PayFlow.Application.Abstractions;
using PayFlow.Contracts.Audit;
using PayFlow.Contracts.Common;
using PayFlow.Domain.Entities;

namespace PayFlow.Application.Features.Audit;

public interface IAuditLogService
{
    Task<PagedApiResponse<AuditEntryDto>> GetAuditLogsPagedAsync(PagedFilterParams filter, CancellationToken ct = default);
}

public class AuditLogService : IAuditLogService
{
    private readonly IAuditRepository _auditRepository;

    public AuditLogService(IAuditRepository auditRepository)
    {
        _auditRepository = auditRepository;
    }

    public async Task<PagedApiResponse<AuditEntryDto>> GetAuditLogsPagedAsync(PagedFilterParams filter, CancellationToken ct = default)
    {
        var page = Math.Max(1, filter.Page);
        var perPage = Math.Clamp(filter.PerPage, 1, 100);

        var (items, total) = await _auditRepository.GetAuditEntriesPagedAsync(page, perPage, ct);

        var dtos = items.Select(MapToDto).ToList();
        return PagedApiResponse<AuditEntryDto>.Ok(dtos, page, perPage, total);
    }

    private static AuditEntryDto MapToDto(AuditEntry e) => new(
        e.Id,
        e.ActorUserId,
        e.Action,
        e.EntityType,
        e.EntityId,
        e.CorrelationId,
        e.MetadataJson,
        e.CreatedAt
    );
}
