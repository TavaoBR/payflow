using PayFlow.Application.Abstractions;
using PayFlow.Application.Exceptions;
using PayFlow.Contracts.Common;
using PayFlow.Contracts.Orders;
using PayFlow.Domain.Entities;
using PayFlow.Domain.Enums;
using PayFlow.Domain.ValueObjects;

namespace PayFlow.Application.Features.Orders;

public interface IOrderService
{
    Task<PagedApiResponse<OrderDto>> GetOrdersPagedAsync(PagedFilterParams filter, Guid? customerId, CancellationToken ct = default);
    Task<OrderDetailDto> GetOrderByIdAsync(Guid id, CancellationToken ct = default);
    Task<OrderDetailDto> CreateOrderAsync(CreateOrderRequest request, CancellationToken ct = default);
    Task<OrderDetailDto> CancelOrderAsync(Guid id, CancellationToken ct = default);
}

public class OrderService : IOrderService
{
    private readonly IOrderRepository _orderRepository;
    private readonly IProductRepository _productRepository;
    private readonly ICustomerRepository _customerRepository;
    private readonly ITenantContext _tenantContext;
    private readonly IAuditService _auditService;

    public OrderService(
        IOrderRepository orderRepository,
        IProductRepository productRepository,
        ICustomerRepository customerRepository,
        ITenantContext tenantContext,
        IAuditService auditService)
    {
        _orderRepository = orderRepository;
        _productRepository = productRepository;
        _customerRepository = customerRepository;
        _tenantContext = tenantContext;
        _auditService = auditService;
    }

    public async Task<PagedApiResponse<OrderDto>> GetOrdersPagedAsync(PagedFilterParams filter, Guid? customerId, CancellationToken ct = default)
    {
        var page = Math.Max(1, filter.Page);
        var perPage = Math.Clamp(filter.PerPage, 1, 100);

        var (items, total) = await _orderRepository.GetOrdersPagedAsync(page, perPage, filter.Status, customerId, ct);

        var dtos = items.Select(MapToDto).ToList();
        return PagedApiResponse<OrderDto>.Ok(dtos, page, perPage, total);
    }

    public async Task<OrderDetailDto> GetOrderByIdAsync(Guid id, CancellationToken ct = default)
    {
        var order = await _orderRepository.GetByIdWithDetailsAsync(id, ct);
        if (order == null)
            throw new NotFoundException("Order", id);

        return MapToDetailDto(order);
    }

    public async Task<OrderDetailDto> CreateOrderAsync(CreateOrderRequest request, CancellationToken ct = default)
    {
        if (request.Items == null || !request.Items.Any())
            throw new ValidationException("items", "order.empty_items", "O pedido precisa conter pelo menos um item.");

        var tenantId = _tenantContext.CurrentTenantId ?? throw new UnauthorizedException("Tenant não identificado.");

        Customer? customer = null;
        if (request.CustomerId.HasValue)
        {
            customer = await _customerRepository.GetByIdWithOrdersAsync(request.CustomerId.Value, ct);
            if (customer == null)
                throw new NotFoundException("Customer", request.CustomerId.Value);
        }
        else if (!string.IsNullOrWhiteSpace(request.CustomerEmail))
        {
            customer = await _customerRepository.GetByEmailAsync(request.CustomerEmail.Trim(), ct);
            if (customer == null && !string.IsNullOrWhiteSpace(request.CustomerName))
            {
                customer = new Customer
                {
                    TenantId = tenantId,
                    Name = request.CustomerName.Trim(),
                    Email = request.CustomerEmail.Trim().ToLowerInvariant(),
                    Status = CustomerStatus.Active
                };
                await _customerRepository.AddAsync(customer, ct);
                await _customerRepository.SaveChangesAsync(ct);
            }
        }

        var publicCode = $"ORD-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString("N")[..6].ToUpperInvariant()}";

        var order = new Order
        {
            TenantId = tenantId,
            CustomerId = customer?.Id,
            Customer = customer,
            PublicCode = publicCode,
            Status = OrderStatus.PendingPayment,
            Currency = Money.DefaultCurrency
        };

        foreach (var itemReq in request.Items)
        {
            if (itemReq.Quantity <= 0)
                throw new ValidationException("quantity", "order.invalid_quantity", "Quantidade do item deve ser maior que zero.");

            string description = itemReq.Description ?? "Item";
            decimal unitAmount = itemReq.UnitAmount ?? 0m;

            if (itemReq.ProductId.HasValue)
            {
                var product = await _productRepository.GetByIdAsync(itemReq.ProductId.Value, ct);
                if (product == null)
                    throw new NotFoundException("Product", itemReq.ProductId.Value);

                description = product.Name;
                unitAmount = product.PriceAmount;
            }

            order.AddItem(itemReq.ProductId, description, itemReq.Quantity, unitAmount);
        }

        if (request.DiscountAmount.HasValue && request.DiscountAmount.Value > 0)
        {
            order.ApplyDiscount(request.DiscountAmount.Value);
        }

        await _orderRepository.AddAsync(order, ct);
        await _orderRepository.SaveChangesAsync(ct);

        await _auditService.LogAsync("order.create", "Order", order.Id, new { order.PublicCode, order.TotalAmount }, ct);

        return MapToDetailDto(order);
    }

    public async Task<OrderDetailDto> CancelOrderAsync(Guid id, CancellationToken ct = default)
    {
        var order = await _orderRepository.GetByIdWithDetailsAsync(id, ct);
        if (order == null)
            throw new NotFoundException("Order", id);

        if (order.Status == OrderStatus.Paid)
        {
            throw new ConflictException("order.cannot_cancel_paid", "Não é possível cancelar um pedido que já foi pago. Utilize a solicitação de reembolso.");
        }

        order.Status = OrderStatus.Cancelled;
        await _orderRepository.UpdateAsync(order, ct);
        await _orderRepository.SaveChangesAsync(ct);

        await _auditService.LogAsync("order.cancel", "Order", order.Id, new { order.PublicCode }, ct);

        return MapToDetailDto(order);
    }

    private static OrderDto MapToDto(Order o) => new(
        o.Id,
        o.PublicCode,
        o.CustomerId,
        o.Customer?.Name,
        o.Customer?.Email,
        o.Status.ToString().ToLowerInvariant(),
        o.SubtotalAmount,
        o.DiscountAmount,
        o.TotalAmount,
        o.Currency,
        o.Items.Count,
        o.CreatedAt
    );

    private static OrderDetailDto MapToDetailDto(Order o)
    {
        var items = o.Items.Select(i => new OrderItemDto(
            i.Id,
            i.ProductId,
            i.DescriptionSnapshot,
            i.Quantity,
            i.UnitAmount,
            i.TotalAmount
        )).ToList();

        var transactions = o.Transactions.Select(t => new OrderTransactionSummaryDto(
            t.Id,
            t.Method.ToString().ToLowerInvariant(),
            t.Status.ToString().ToLowerInvariant(),
            t.Amount,
            t.Currency,
            t.PaidAt,
            t.CreatedAt
        )).ToList();

        return new OrderDetailDto(
            o.Id,
            o.PublicCode,
            o.CustomerId,
            o.Customer?.Name,
            o.Customer?.Email,
            o.Status.ToString().ToLowerInvariant(),
            o.SubtotalAmount,
            o.DiscountAmount,
            o.TotalAmount,
            o.Currency,
            items,
            transactions,
            o.CreatedAt
        );
    }
}
