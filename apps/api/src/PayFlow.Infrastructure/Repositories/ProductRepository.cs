using Microsoft.EntityFrameworkCore;
using PayFlow.Application.Abstractions;
using PayFlow.Domain.Entities;
using PayFlow.Domain.Enums;
using PayFlow.Infrastructure.Persistence;

namespace PayFlow.Infrastructure.Repositories;

public class ProductRepository : IProductRepository
{
    private readonly PayFlowDbContext _dbContext;

    public ProductRepository(PayFlowDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<(IReadOnlyList<Product> Items, long Total)> GetProductsPagedAsync(int page, int perPage, string? search, string? type, string? status, string? sort, CancellationToken ct = default)
    {
        var query = _dbContext.Products.AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim();
            query = query.Where(p => p.Name.Contains(term) || p.Sku.Contains(term));
        }

        if (!string.IsNullOrWhiteSpace(type) && Enum.TryParse<ProductType>(type, true, out var prodType))
        {
            query = query.Where(p => p.Type == prodType);
        }

        if (!string.IsNullOrWhiteSpace(status) && Enum.TryParse<ProductStatus>(status, true, out var prodStatus))
        {
            query = query.Where(p => p.Status == prodStatus);
        }

        query = sort?.ToLowerInvariant() switch
        {
            "price_asc" or "price" => query.OrderBy(p => p.PriceAmount),
            "price_desc" or "-price" => query.OrderByDescending(p => p.PriceAmount),
            "name_asc" or "name" => query.OrderBy(p => p.Name),
            "name_desc" or "-name" => query.OrderByDescending(p => p.Name),
            "oldest" or "created_at" or "createdat" => query.OrderBy(p => p.CreatedAt),
            _ => query.OrderByDescending(p => p.CreatedAt)
        };

        var total = await query.LongCountAsync(ct);
        var items = await query
            .Skip((page - 1) * perPage)
            .Take(perPage)
            .ToListAsync(ct);

        return (items, total);
    }

    public async Task<Product?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        return await _dbContext.Products.FirstOrDefaultAsync(p => p.Id == id, ct);
    }

    public async Task<Product?> GetBySlugAsync(string slug, CancellationToken ct = default)
    {
        return await _dbContext.Products.FirstOrDefaultAsync(p => p.Slug == slug, ct);
    }

    public async Task AddAsync(Product product, CancellationToken ct = default)
    {
        await _dbContext.Products.AddAsync(product, ct);
    }

    public Task UpdateAsync(Product product, CancellationToken ct = default)
    {
        _dbContext.Products.Update(product);
        return Task.CompletedTask;
    }

    public Task DeleteAsync(Product product, CancellationToken ct = default)
    {
        _dbContext.Products.Remove(product);
        return Task.CompletedTask;
    }

    public Task SaveChangesAsync(CancellationToken ct = default)
    {
        return _dbContext.SaveChangesAsync(ct);
    }
}
