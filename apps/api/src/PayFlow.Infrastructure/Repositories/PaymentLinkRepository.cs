using Microsoft.EntityFrameworkCore;
using PayFlow.Application.Abstractions;
using PayFlow.Domain.Entities;
using PayFlow.Domain.Enums;
using PayFlow.Infrastructure.Persistence;

namespace PayFlow.Infrastructure.Repositories;

public class PaymentLinkRepository : IPaymentLinkRepository
{
    private readonly PayFlowDbContext _dbContext;

    public PaymentLinkRepository(PayFlowDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<(IReadOnlyList<PaymentLink> Items, long Total)> GetPaymentLinksPagedAsync(int page, int perPage, string? status, CancellationToken ct = default)
    {
        var query = _dbContext.PaymentLinks
            .Include(l => l.Product)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(status) && Enum.TryParse<PaymentLinkStatus>(status, true, out var plStatus))
        {
            query = query.Where(l => l.Status == plStatus);
        }

        var total = await query.LongCountAsync(ct);
        var items = await query
            .OrderByDescending(l => l.CreatedAt)
            .Skip((page - 1) * perPage)
            .Take(perPage)
            .ToListAsync(ct);

        return (items, total);
    }

    public async Task<PaymentLink?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        return await _dbContext.PaymentLinks
            .Include(l => l.Product)
            .FirstOrDefaultAsync(l => l.Id == id, ct);
    }

    public async Task<PaymentLink?> GetByPublicTokenAsync(string publicToken, CancellationToken ct = default)
    {
        return await _dbContext.PaymentLinks
            .IgnoreQueryFilters()
            .Include(l => l.Product)
            .FirstOrDefaultAsync(l => l.PublicToken == publicToken, ct);
    }

    public async Task AddAsync(PaymentLink link, CancellationToken ct = default)
    {
        await _dbContext.PaymentLinks.AddAsync(link, ct);
    }

    public Task UpdateAsync(PaymentLink link, CancellationToken ct = default)
    {
        _dbContext.PaymentLinks.Update(link);
        return Task.CompletedTask;
    }

    public Task SaveChangesAsync(CancellationToken ct = default)
    {
        return _dbContext.SaveChangesAsync(ct);
    }
}
