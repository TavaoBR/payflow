using Microsoft.EntityFrameworkCore;
using PayFlow.Application.Abstractions;
using PayFlow.Domain.Entities;
using PayFlow.Infrastructure.Persistence;

namespace PayFlow.Infrastructure.Repositories;

public class CheckoutSessionRepository : ICheckoutSessionRepository
{
    private readonly PayFlowDbContext _dbContext;

    public CheckoutSessionRepository(PayFlowDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<CheckoutSession?> GetByIdWithDetailsAsync(Guid id, CancellationToken ct = default)
    {
        return await _dbContext.CheckoutSessions
            .IgnoreQueryFilters()
            .Include(s => s.PaymentLink)
            .Include(s => s.Order)
                .ThenInclude(o => o!.Customer)
            .Include(s => s.Order)
                .ThenInclude(o => o!.Items)
            .Include(s => s.Transactions)
            .FirstOrDefaultAsync(s => s.Id == id, ct);
    }

    public async Task<CheckoutSession?> GetByPublicTokenAsync(string publicToken, CancellationToken ct = default)
    {
        return await _dbContext.CheckoutSessions
            .IgnoreQueryFilters()
            .Include(s => s.PaymentLink)
            .Include(s => s.Order)
                .ThenInclude(o => o!.Customer)
            .Include(s => s.Order)
                .ThenInclude(o => o!.Items)
            .Include(s => s.Transactions)
            .FirstOrDefaultAsync(s => s.PublicToken == publicToken, ct);
    }

    public async Task AddAsync(CheckoutSession session, CancellationToken ct = default)
    {
        await _dbContext.CheckoutSessions.AddAsync(session, ct);
    }

    public Task UpdateAsync(CheckoutSession session, CancellationToken ct = default)
    {
        _dbContext.CheckoutSessions.Update(session);
        return Task.CompletedTask;
    }

    public Task SaveChangesAsync(CancellationToken ct = default)
    {
        return _dbContext.SaveChangesAsync(ct);
    }
}
