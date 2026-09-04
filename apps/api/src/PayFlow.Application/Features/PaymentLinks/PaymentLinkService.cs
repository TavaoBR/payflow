using PayFlow.Application.Abstractions;
using PayFlow.Application.Exceptions;
using PayFlow.Contracts.Common;
using PayFlow.Contracts.PaymentLinks;
using PayFlow.Domain.Entities;
using PayFlow.Domain.Enums;
using PayFlow.Domain.ValueObjects;

namespace PayFlow.Application.Features.PaymentLinks;

public interface IPaymentLinkService
{
    Task<PagedApiResponse<PaymentLinkDto>> GetPaymentLinksPagedAsync(PagedFilterParams filter, CancellationToken ct = default);
    Task<PaymentLinkDto> GetPaymentLinkByIdAsync(Guid id, CancellationToken ct = default);
    Task<PaymentLinkDto> CreatePaymentLinkAsync(CreatePaymentLinkRequest request, CancellationToken ct = default);
    Task<PaymentLinkDto> UpdatePaymentLinkAsync(Guid id, UpdatePaymentLinkRequest request, CancellationToken ct = default);
    Task<PaymentLinkDto> PausePaymentLinkAsync(Guid id, CancellationToken ct = default);
    Task<PaymentLinkDto> ActivatePaymentLinkAsync(Guid id, CancellationToken ct = default);
}

public class PaymentLinkService : IPaymentLinkService
{
    private readonly IPaymentLinkRepository _linkRepository;
    private readonly IProductRepository _productRepository;
    private readonly ITenantContext _tenantContext;
    private readonly IAuditService _auditService;

    public PaymentLinkService(
        IPaymentLinkRepository linkRepository,
        IProductRepository productRepository,
        ITenantContext tenantContext,
        IAuditService auditService)
    {
        _linkRepository = linkRepository;
        _productRepository = productRepository;
        _tenantContext = tenantContext;
        _auditService = auditService;
    }

    public async Task<PagedApiResponse<PaymentLinkDto>> GetPaymentLinksPagedAsync(PagedFilterParams filter, CancellationToken ct = default)
    {
        var page = Math.Max(1, filter.Page);
        var perPage = Math.Clamp(filter.PerPage, 1, 100);

        var (items, total) = await _linkRepository.GetPaymentLinksPagedAsync(page, perPage, filter.Status, ct);

        var dtos = items.Select(MapToDto).ToList();
        return PagedApiResponse<PaymentLinkDto>.Ok(dtos, page, perPage, total);
    }

    public async Task<PaymentLinkDto> GetPaymentLinkByIdAsync(Guid id, CancellationToken ct = default)
    {
        var link = await _linkRepository.GetByIdAsync(id, ct);
        if (link == null)
            throw new NotFoundException("PaymentLink", id);

        return MapToDto(link);
    }

    public async Task<PaymentLinkDto> CreatePaymentLinkAsync(CreatePaymentLinkRequest request, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(request.Title))
            throw new ValidationException("title", "payment_link.title_required", "Título do link de pagamento é obrigatório.");

        var tenantId = _tenantContext.CurrentTenantId ?? throw new UnauthorizedException("Tenant não identificado.");

        decimal? amount = request.FixedAmount;
        Product? product = null;

        if (request.ProductId.HasValue)
        {
            product = await _productRepository.GetByIdAsync(request.ProductId.Value, ct);
            if (product == null)
                throw new NotFoundException("Product", request.ProductId.Value);

            amount ??= product.PriceAmount;
        }

        if (!amount.HasValue || amount <= 0)
        {
            throw new ValidationException("fixedAmount", "payment_link.invalid_amount", "Valor do link de pagamento deve ser maior que zero.");
        }

        var publicToken = $"plk_{Guid.NewGuid():N}";
        var methods = request.AllowedMethods != null && request.AllowedMethods.Any()
            ? string.Join(",", request.AllowedMethods)
            : "Pix,CreditCard,Boleto";

        var link = new PaymentLink
        {
            TenantId = tenantId,
            PublicToken = publicToken,
            Title = request.Title.Trim(),
            Description = request.Description?.Trim(),
            ProductId = request.ProductId,
            Product = product,
            FixedAmount = amount,
            Currency = string.IsNullOrWhiteSpace(request.Currency) ? Money.DefaultCurrency : request.Currency.Trim().ToUpperInvariant(),
            AllowedMethods = methods,
            PixDiscountPct = request.PixDiscountPct ?? 0m,
            MaxInstallments = request.MaxInstallments ?? 12,
            ExpiresAt = request.ExpiresAt,
            Status = PaymentLinkStatus.Active
        };

        await _linkRepository.AddAsync(link, ct);
        await _linkRepository.SaveChangesAsync(ct);

        await _auditService.LogAsync("payment_link.create", "PaymentLink", link.Id, new { link.Title, link.PublicToken }, ct);

        return MapToDto(link);
    }

    public async Task<PaymentLinkDto> UpdatePaymentLinkAsync(Guid id, UpdatePaymentLinkRequest request, CancellationToken ct = default)
    {
        var link = await _linkRepository.GetByIdAsync(id, ct);
        if (link == null)
            throw new NotFoundException("PaymentLink", id);

        if (!string.IsNullOrWhiteSpace(request.Title))
            link.Title = request.Title.Trim();

        link.Description = request.Description?.Trim();

        if (request.FixedAmount.HasValue && request.FixedAmount.Value > 0)
            link.FixedAmount = request.FixedAmount.Value;

        if (request.AllowedMethods != null && request.AllowedMethods.Any())
            link.AllowedMethods = string.Join(",", request.AllowedMethods);

        if (request.PixDiscountPct.HasValue)
            link.PixDiscountPct = request.PixDiscountPct.Value;

        if (request.MaxInstallments.HasValue)
            link.MaxInstallments = request.MaxInstallments.Value;

        if (request.ExpiresAt.HasValue)
            link.ExpiresAt = request.ExpiresAt.Value;

        if (!string.IsNullOrWhiteSpace(request.Status) && Enum.TryParse<PaymentLinkStatus>(request.Status, true, out var status))
            link.Status = status;

        await _linkRepository.UpdateAsync(link, ct);
        await _linkRepository.SaveChangesAsync(ct);

        await _auditService.LogAsync("payment_link.update", "PaymentLink", link.Id, new { link.Title }, ct);

        return MapToDto(link);
    }

    public async Task<PaymentLinkDto> PausePaymentLinkAsync(Guid id, CancellationToken ct = default)
    {
        var link = await _linkRepository.GetByIdAsync(id, ct);
        if (link == null)
            throw new NotFoundException("PaymentLink", id);

        link.Status = PaymentLinkStatus.Archived;
        await _linkRepository.UpdateAsync(link, ct);
        await _linkRepository.SaveChangesAsync(ct);

        await _auditService.LogAsync("payment_link.pause", "PaymentLink", link.Id, null, ct);

        return MapToDto(link);
    }

    public async Task<PaymentLinkDto> ActivatePaymentLinkAsync(Guid id, CancellationToken ct = default)
    {
        var link = await _linkRepository.GetByIdAsync(id, ct);
        if (link == null)
            throw new NotFoundException("PaymentLink", id);

        link.Status = PaymentLinkStatus.Active;
        await _linkRepository.UpdateAsync(link, ct);
        await _linkRepository.SaveChangesAsync(ct);

        await _auditService.LogAsync("payment_link.activate", "PaymentLink", link.Id, null, ct);

        return MapToDto(link);
    }

    private static PaymentLinkDto MapToDto(PaymentLink l)
    {
        var allowed = l.AllowedMethods.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
        return new PaymentLinkDto(
            l.Id,
            l.PublicToken,
            l.Title,
            l.Description,
            l.ProductId,
            l.Product?.Name,
            l.FixedAmount,
            l.Currency,
            allowed,
            l.PixDiscountPct,
            l.MaxInstallments,
            l.ExpiresAt,
            l.Status.ToString().ToLowerInvariant(),
            $"/checkout/{l.PublicToken}",
            l.CreatedAt
        );
    }
}
