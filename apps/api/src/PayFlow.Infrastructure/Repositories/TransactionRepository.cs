using Microsoft.EntityFrameworkCore;
using PayFlow.Application.Abstractions;
using PayFlow.Domain.Entities;
using PayFlow.Domain.Enums;
using PayFlow.Infrastructure.Persistence;

namespace PayFlow.Infrastructure.Repositories;

public class TransactionRepository : ITransactionRepository
{
    private readonly PayFlowDbContext _dbContext;

    public TransactionRepository(PayFlowDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<(IReadOnlyList<PaymentTransaction> Items, long Total)> GetTransactionsPagedAsync(int page, int perPage, string? status, string? method, CancellationToken ct = default)
    {
        var query = _dbContext.PaymentTransactions
            .Include(t => t.Order)
                .ThenInclude(o => o!.Customer)
            .Include(t => t.Metadata)
            .Include(t => t.Refunds)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(status) && Enum.TryParse<TransactionStatus>(status, true, out var txStatus))
        {
            query = query.Where(t => t.Status == txStatus);
        }

        if (!string.IsNullOrWhiteSpace(method) && Enum.TryParse<PaymentMethod>(method, true, out var pm))
        {
            query = query.Where(t => t.Method == pm);
        }

        var total = await query.LongCountAsync(ct);
        var items = await query
            .OrderByDescending(t => t.CreatedAt)
            .Skip((page - 1) * perPage)
            .Take(perPage)
            .ToListAsync(ct);

        return (items, total);
    }

    public async Task<PaymentTransaction?> GetByIdWithDetailsAsync(Guid id, CancellationToken ct = default)
    {
        return await _dbContext.PaymentTransactions
            .Include(t => t.Order)
                .ThenInclude(o => o!.Customer)
            .Include(t => t.Metadata)
            .Include(t => t.Refunds)
            .FirstOrDefaultAsync(t => t.Id == id, ct);
    }

    public async Task<PaymentTransaction?> GetByIdempotencyKeyAsync(string idempotencyKey, CancellationToken ct = default)
    {
        return await _dbContext.PaymentTransactions
            .Include(t => t.Order)
            .Include(t => t.Metadata)
            .FirstOrDefaultAsync(t => t.IdempotencyKey == idempotencyKey, ct);
    }

    public async Task AddAsync(PaymentTransaction transaction, CancellationToken ct = default)
    {
        await _dbContext.PaymentTransactions.AddAsync(transaction, ct);
    }

    public Task UpdateAsync(PaymentTransaction transaction, CancellationToken ct = default)
    {
        _dbContext.PaymentTransactions.Update(transaction);
        return Task.CompletedTask;
    }

    public async Task AddRefundAsync(Refund refund, CancellationToken ct = default)
    {
        await _dbContext.Refunds.AddAsync(refund, ct);
    }

    public Task SaveChangesAsync(CancellationToken ct = default)
    {
        return _dbContext.SaveChangesAsync(ct);
    }
}
