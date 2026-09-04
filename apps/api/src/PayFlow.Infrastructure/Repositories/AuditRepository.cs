using Microsoft.EntityFrameworkCore;
using PayFlow.Application.Abstractions;
using PayFlow.Domain.Entities;
using PayFlow.Infrastructure.Persistence;

namespace PayFlow.Infrastructure.Repositories;

public class AuditRepository : IAuditRepository
{
    private readonly PayFlowDbContext _dbContext;

    public AuditRepository(PayFlowDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<(IReadOnlyList<AuditEntry> Items, long Total)> GetAuditEntriesPagedAsync(int page, int perPage, CancellationToken ct = default)
    {
        var query = _dbContext.AuditEntries.AsQueryable();

        var total = await query.LongCountAsync(ct);
        var items = await query
            .OrderByDescending(e => e.CreatedAt)
            .Skip((page - 1) * perPage)
            .Take(perPage)
            .ToListAsync(ct);

        return (items, total);
    }

    public async Task AddAsync(AuditEntry entry, CancellationToken ct = default)
    {
        await _dbContext.AuditEntries.AddAsync(entry, ct);
    }

    public Task SaveChangesAsync(CancellationToken ct = default)
    {
        return _dbContext.SaveChangesAsync(ct);
    }
}
