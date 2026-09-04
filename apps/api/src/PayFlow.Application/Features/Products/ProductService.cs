using System.Globalization;
using System.Text.RegularExpressions;
using PayFlow.Application.Abstractions;
using PayFlow.Application.Exceptions;
using PayFlow.Contracts.Common;
using PayFlow.Contracts.Products;
using PayFlow.Domain.Entities;
using PayFlow.Domain.Enums;
using PayFlow.Domain.ValueObjects;

namespace PayFlow.Application.Features.Products;

public interface IProductService
{
    Task<PagedApiResponse<ProductDto>> GetProductsPagedAsync(PagedFilterParams filter, string? type, CancellationToken ct = default);
    Task<ProductDto> GetProductByIdAsync(Guid id, CancellationToken ct = default);
    Task<ProductDto> CreateProductAsync(CreateProductRequest request, CancellationToken ct = default);
    Task<ProductDto> UpdateProductAsync(Guid id, UpdateProductRequest request, CancellationToken ct = default);
    Task<ProductDto> UpdateProductStatusAsync(Guid id, UpdateProductStatusRequest request, CancellationToken ct = default);
    Task DeleteProductAsync(Guid id, CancellationToken ct = default);
}

public class ProductService : IProductService
{
    private readonly IProductRepository _productRepository;
    private readonly ITenantContext _tenantContext;
    private readonly IAuditService _auditService;

    public ProductService(
        IProductRepository productRepository,
        ITenantContext tenantContext,
        IAuditService auditService)
    {
        _productRepository = productRepository;
        _tenantContext = tenantContext;
        _auditService = auditService;
    }

    public async Task<PagedApiResponse<ProductDto>> GetProductsPagedAsync(PagedFilterParams filter, string? type, CancellationToken ct = default)
    {
        var page = Math.Max(1, filter.Page);
        var perPage = Math.Clamp(filter.PerPage, 1, 100);

        var (items, total) = await _productRepository.GetProductsPagedAsync(page, perPage, filter.Search, type, filter.Status, filter.Sort, ct);

        var dtos = items.Select(MapToDto).ToList();
        return PagedApiResponse<ProductDto>.Ok(dtos, page, perPage, total);
    }

    public async Task<ProductDto> GetProductByIdAsync(Guid id, CancellationToken ct = default)
    {
        var product = await _productRepository.GetByIdAsync(id, ct);
        if (product == null)
            throw new NotFoundException("Product", id);

        return MapToDto(product);
    }

    public async Task<ProductDto> CreateProductAsync(CreateProductRequest request, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            throw new ValidationException("name", "product.name_required", "Nome do produto é obrigatório.");
        if (request.PriceAmount < 0)
            throw new ValidationException("priceAmount", "product.invalid_price", "Preço não pode ser negativo.");

        var tenantId = _tenantContext.CurrentTenantId ?? throw new UnauthorizedException("Tenant não identificado.");

        var slug = GenerateSlug(request.Name);
        var existingSlug = await _productRepository.GetBySlugAsync(slug, ct);
        if (existingSlug != null)
        {
            slug = $"{slug}-{Guid.NewGuid().ToString("N")[..6]}";
        }

        var productType = ProductType.Digital;
        if (!string.IsNullOrWhiteSpace(request.Type) && Enum.TryParse<ProductType>(request.Type, true, out var parsedType))
        {
            productType = parsedType;
        }

        var status = ProductStatus.Active;
        if (!string.IsNullOrWhiteSpace(request.Status) && Enum.TryParse<ProductStatus>(request.Status, true, out var parsedStatus))
        {
            status = parsedStatus;
        }

        var product = new Product
        {
            TenantId = tenantId,
            Name = request.Name.Trim(),
            Slug = slug,
            Sku = string.IsNullOrWhiteSpace(request.Sku) ? $"SKU-{Guid.NewGuid().ToString("N")[..8].ToUpperInvariant()}" : request.Sku.Trim(),
            Type = productType,
            Description = request.Description?.Trim(),
            PriceAmount = request.PriceAmount,
            Currency = string.IsNullOrWhiteSpace(request.Currency) ? Money.DefaultCurrency : request.Currency.Trim().ToUpperInvariant(),
            Status = status,
            StockMode = string.IsNullOrWhiteSpace(request.StockMode) ? "Unlimited" : request.StockMode.Trim(),
            StockQuantity = request.StockQuantity ?? 0,
            ImageUrl = request.ImageUrl?.Trim()
        };

        await _productRepository.AddAsync(product, ct);
        await _productRepository.SaveChangesAsync(ct);

        await _auditService.LogAsync("product.create", "Product", product.Id, new { product.Name, product.PriceAmount }, ct);

        return MapToDto(product);
    }

    public async Task<ProductDto> UpdateProductAsync(Guid id, UpdateProductRequest request, CancellationToken ct = default)
    {
        var product = await _productRepository.GetByIdAsync(id, ct);
        if (product == null)
            throw new NotFoundException("Product", id);

        if (string.IsNullOrWhiteSpace(request.Name))
            throw new ValidationException("name", "product.name_required", "Nome do produto é obrigatório.");
        if (request.PriceAmount < 0)
            throw new ValidationException("priceAmount", "product.invalid_price", "Preço não pode ser negativo.");

        product.Name = request.Name.Trim();
        product.PriceAmount = request.PriceAmount;
        product.Description = request.Description?.Trim();

        if (!string.IsNullOrWhiteSpace(request.Sku))
            product.Sku = request.Sku.Trim();

        if (!string.IsNullOrWhiteSpace(request.Currency))
            product.Currency = request.Currency.Trim().ToUpperInvariant();

        if (!string.IsNullOrWhiteSpace(request.Type) && Enum.TryParse<ProductType>(request.Type, true, out var parsedType))
            product.Type = parsedType;

        if (!string.IsNullOrWhiteSpace(request.Status) && Enum.TryParse<ProductStatus>(request.Status, true, out var parsedStatus))
            product.Status = parsedStatus;

        if (!string.IsNullOrWhiteSpace(request.StockMode))
            product.StockMode = request.StockMode.Trim();

        if (request.StockQuantity.HasValue)
            product.StockQuantity = request.StockQuantity.Value;

        if (request.ImageUrl != null)
            product.ImageUrl = request.ImageUrl.Trim();

        await _productRepository.UpdateAsync(product, ct);
        await _productRepository.SaveChangesAsync(ct);

        await _auditService.LogAsync("product.update", "Product", product.Id, new { product.Name, product.PriceAmount }, ct);

        return MapToDto(product);
    }

    public async Task<ProductDto> UpdateProductStatusAsync(Guid id, UpdateProductStatusRequest request, CancellationToken ct = default)
    {
        var product = await _productRepository.GetByIdAsync(id, ct);
        if (product == null)
            throw new NotFoundException("Product", id);

        if (Enum.TryParse<ProductStatus>(request.Status, true, out var status))
        {
            product.Status = status;
            await _productRepository.UpdateAsync(product, ct);
            await _productRepository.SaveChangesAsync(ct);

            await _auditService.LogAsync("product.status_update", "Product", product.Id, new { Status = status.ToString() }, ct);
            return MapToDto(product);
        }

        throw new ValidationException("status", "product.invalid_status", "Status informado inválido. Use 'active', 'archived' ou 'draft'.");
    }

    public async Task DeleteProductAsync(Guid id, CancellationToken ct = default)
    {
        var product = await _productRepository.GetByIdAsync(id, ct);
        if (product == null)
            throw new NotFoundException("Product", id);

        await _productRepository.DeleteAsync(product, ct);
        await _productRepository.SaveChangesAsync(ct);

        await _auditService.LogAsync("product.delete", "Product", id, new { product.Name }, ct);
    }

    private static ProductDto MapToDto(Product p) => new(
        p.Id,
        p.Name,
        p.Slug,
        p.Sku,
        p.Type.ToString().ToLowerInvariant(),
        p.Description,
        p.PriceAmount,
        p.PriceAmount.ToString("F2", CultureInfo.InvariantCulture),
        p.Currency,
        p.Status.ToString().ToLowerInvariant(),
        p.StockMode,
        p.StockQuantity,
        p.ImageUrl,
        p.CreatedAt,
        p.UpdatedAt
    );

    private static string GenerateSlug(string text)
    {
        var str = text.ToLowerInvariant().Trim();
        str = Regex.Replace(str, @"\s+", "-");
        str = Regex.Replace(str, @"[^a-z0-9\-]", "");
        return str.Trim('-');
    }
}
