using Microsoft.EntityFrameworkCore;
using PayFlow.Application.Abstractions;
using PayFlow.Domain.Entities;
using PayFlow.Domain.Enums;
using PayFlow.Infrastructure.Persistence;

namespace PayFlow.Infrastructure.Repositories;

public class CustomerRepository : ICustomerRepository
{
    private readonly PayFlowDbContext _dbContext;

    public CustomerRepository(PayFlowDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<(IReadOnlyList<Customer> Items, long Total)> GetCustomersPagedAsync(int page, int perPage, string? search, string? status, CancellationToken ct = default)
    {
        var query = _dbContext.Customers
            .Include(c => c.Orders)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim();
            query = query.Where(c => c.Name.Contains(term) || c.Email.Contains(term) || (c.Phone != null && c.Phone.Contains(term)));
        }

        if (!string.IsNullOrWhiteSpace(status) && Enum.TryParse<CustomerStatus>(status, true, out var custStatus))
        {
            query = query.Where(c => c.Status == custStatus);
        }

        var total = await query.LongCountAsync(ct);
        var items = await query
            .OrderByDescending(c => c.CreatedAt)
            .Skip((page - 1) * perPage)
            .Take(perPage)
            .ToListAsync(ct);

        return (items, total);
    }

    public async Task<Customer?> GetByIdWithOrdersAsync(Guid id, CancellationToken ct = default)
    {
        return await _dbContext.Customers
            .Include(c => c.Orders)
            .FirstOrDefaultAsync(c => c.Id == id, ct);
    }

    public async Task<Customer?> GetByEmailAsync(string email, CancellationToken ct = default)
    {
        var normalized = email.Trim().ToLowerInvariant();
        return await _dbContext.Customers
            .FirstOrDefaultAsync(c => c.Email == normalized, ct);
    }

    public async Task AddAsync(Customer customer, CancellationToken ct = default)
    {
        await _dbContext.Customers.AddAsync(customer, ct);
    }

    public Task UpdateAsync(Customer customer, CancellationToken ct = default)
    {
        _dbContext.Customers.Update(customer);
        return Task.CompletedTask;
    }

    public Task SaveChangesAsync(CancellationToken ct = default)
    {
        return _dbContext.SaveChangesAsync(ct);
    }
}
