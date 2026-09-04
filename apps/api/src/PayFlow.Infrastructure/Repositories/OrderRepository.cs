using Microsoft.EntityFrameworkCore;
using PayFlow.Application.Abstractions;
using PayFlow.Domain.Entities;
using PayFlow.Domain.Enums;
using PayFlow.Infrastructure.Persistence;

namespace PayFlow.Infrastructure.Repositories;

public class OrderRepository : IOrderRepository
{
    private readonly PayFlowDbContext _dbContext;

    public OrderRepository(PayFlowDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<(IReadOnlyList<Order> Items, long Total)> GetOrdersPagedAsync(int page, int perPage, string? status, Guid? customerId, CancellationToken ct = default)
    {
        var query = _dbContext.Orders
            .Include(o => o.Customer)
            .Include(o => o.Items)
            .AsQueryable();

        if (customerId.HasValue)
        {
            query = query.Where(o => o.CustomerId == customerId.Value);
        }

        if (!string.IsNullOrWhiteSpace(status) && Enum.TryParse<OrderStatus>(status, true, out var orderStatus))
        {
            query = query.Where(o => o.Status == orderStatus);
        }

        var total = await query.LongCountAsync(ct);
        var items = await query
            .OrderByDescending(o => o.CreatedAt)
            .Skip((page - 1) * perPage)
            .Take(perPage)
            .ToListAsync(ct);

        return (items, total);
    }

    public async Task<Order?> GetByIdWithDetailsAsync(Guid id, CancellationToken ct = default)
    {
        return await _dbContext.Orders
            .Include(o => o.Customer)
            .Include(o => o.Items)
            .Include(o => o.Transactions)
            .FirstOrDefaultAsync(o => o.Id == id, ct);
    }

    public async Task<Order?> GetByPublicCodeAsync(string publicCode, CancellationToken ct = default)
    {
        return await _dbContext.Orders
            .Include(o => o.Customer)
            .Include(o => o.Items)
            .Include(o => o.Transactions)
            .FirstOrDefaultAsync(o => o.PublicCode == publicCode, ct);
    }

    public async Task AddAsync(Order order, CancellationToken ct = default)
    {
        await _dbContext.Orders.AddAsync(order, ct);
    }

    public Task UpdateAsync(Order order, CancellationToken ct = default)
    {
        _dbContext.Orders.Update(order);
        return Task.CompletedTask;
    }

    public Task SaveChangesAsync(CancellationToken ct = default)
    {
        return _dbContext.SaveChangesAsync(ct);
    }
}
