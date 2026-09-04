using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using PayFlow.Application.Abstractions;
using PayFlow.Application.Exceptions;
using PayFlow.Contracts.Common;
using PayFlow.Contracts.Customers;
using PayFlow.Domain.Entities;
using PayFlow.Domain.Enums;

namespace PayFlow.Application.Features.Customers;

public interface ICustomerService
{
    Task<PagedApiResponse<CustomerDto>> GetCustomersPagedAsync(PagedFilterParams filter, CancellationToken ct = default);
    Task<CustomerDetailDto> GetCustomerByIdAsync(Guid id, CancellationToken ct = default);
    Task<CustomerDto> CreateCustomerAsync(CreateCustomerRequest request, CancellationToken ct = default);
    Task<CustomerDto> UpdateCustomerAsync(Guid id, UpdateCustomerRequest request, CancellationToken ct = default);
    Task<CustomerDto> UpdateCustomerStatusAsync(Guid id, UpdateCustomerStatusRequest request, CancellationToken ct = default);
}

public class CustomerService : ICustomerService
{
    private readonly ICustomerRepository _customerRepository;
    private readonly ITenantContext _tenantContext;
    private readonly IAuditService _auditService;

    public CustomerService(
        ICustomerRepository customerRepository,
        ITenantContext tenantContext,
        IAuditService auditService)
    {
        _customerRepository = customerRepository;
        _tenantContext = tenantContext;
        _auditService = auditService;
    }

    public async Task<PagedApiResponse<CustomerDto>> GetCustomersPagedAsync(PagedFilterParams filter, CancellationToken ct = default)
    {
        var page = Math.Max(1, filter.Page);
        var perPage = Math.Clamp(filter.PerPage, 1, 100);

        var (items, total) = await _customerRepository.GetCustomersPagedAsync(page, perPage, filter.Search, filter.Status, ct);

        var dtos = items.Select(MapToDto).ToList();
        return PagedApiResponse<CustomerDto>.Ok(dtos, page, perPage, total);
    }

    public async Task<CustomerDetailDto> GetCustomerByIdAsync(Guid id, CancellationToken ct = default)
    {
        var customer = await _customerRepository.GetByIdWithOrdersAsync(id, ct);
        if (customer == null)
            throw new NotFoundException("Customer", id);

        var orderSummaries = customer.Orders.OrderByDescending(o => o.CreatedAt).Select(o => new CustomerOrderSummaryDto(
            o.Id,
            o.PublicCode,
            o.Status.ToString().ToLowerInvariant(),
            o.TotalAmount,
            o.Currency,
            o.CreatedAt
        )).ToList();

        var totalSpent = customer.Orders.Where(o => o.Status == OrderStatus.Paid).Sum(o => o.TotalAmount);

        return new CustomerDetailDto(
            customer.Id,
            customer.Name,
            customer.Email,
            customer.Phone,
            customer.DocumentLast4,
            customer.Status.ToString().ToLowerInvariant(),
            customer.Orders.Count,
            totalSpent,
            customer.CreatedAt,
            orderSummaries
        );
    }

    public async Task<CustomerDto> CreateCustomerAsync(CreateCustomerRequest request, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            throw new ValidationException("name", "customer.name_required", "Nome do cliente é obrigatório.");
        if (string.IsNullOrWhiteSpace(request.Email))
            throw new ValidationException("email", "customer.email_required", "E-mail do cliente é obrigatório.");

        var tenantId = _tenantContext.CurrentTenantId ?? throw new UnauthorizedException("Tenant não identificado.");

        var (docHash, docLast4) = ProcessDocument(request.Document);

        var customer = new Customer
        {
            TenantId = tenantId,
            Name = request.Name.Trim(),
            Email = request.Email.Trim().ToLowerInvariant(),
            Phone = request.Phone?.Trim(),
            DocumentHash = docHash,
            DocumentLast4 = docLast4,
            Status = CustomerStatus.Active
        };

        await _customerRepository.AddAsync(customer, ct);
        await _customerRepository.SaveChangesAsync(ct);

        await _auditService.LogAsync("customer.create", "Customer", customer.Id, new { customer.Name, customer.Email }, ct);

        return MapToDto(customer);
    }

    public async Task<CustomerDto> UpdateCustomerAsync(Guid id, UpdateCustomerRequest request, CancellationToken ct = default)
    {
        var customer = await _customerRepository.GetByIdWithOrdersAsync(id, ct);
        if (customer == null)
            throw new NotFoundException("Customer", id);

        if (string.IsNullOrWhiteSpace(request.Name))
            throw new ValidationException("name", "customer.name_required", "Nome do cliente é obrigatório.");
        if (string.IsNullOrWhiteSpace(request.Email))
            throw new ValidationException("email", "customer.email_required", "E-mail do cliente é obrigatório.");

        customer.Name = request.Name.Trim();
        customer.Email = request.Email.Trim().ToLowerInvariant();
        customer.Phone = request.Phone?.Trim();

        if (!string.IsNullOrWhiteSpace(request.Document))
        {
            var (docHash, docLast4) = ProcessDocument(request.Document);
            customer.DocumentHash = docHash;
            customer.DocumentLast4 = docLast4;
        }

        await _customerRepository.UpdateAsync(customer, ct);
        await _customerRepository.SaveChangesAsync(ct);

        await _auditService.LogAsync("customer.update", "Customer", customer.Id, new { customer.Name, customer.Email }, ct);

        return MapToDto(customer);
    }

    public async Task<CustomerDto> UpdateCustomerStatusAsync(Guid id, UpdateCustomerStatusRequest request, CancellationToken ct = default)
    {
        var customer = await _customerRepository.GetByIdWithOrdersAsync(id, ct);
        if (customer == null)
            throw new NotFoundException("Customer", id);

        if (Enum.TryParse<CustomerStatus>(request.Status, true, out var status))
        {
            customer.Status = status;
            await _customerRepository.UpdateAsync(customer, ct);
            await _customerRepository.SaveChangesAsync(ct);

            await _auditService.LogAsync("customer.status_update", "Customer", customer.Id, new { Status = status.ToString() }, ct);
            return MapToDto(customer);
        }

        throw new ValidationException("status", "customer.invalid_status", "Status informado inválido. Use 'active' ou 'inactive'.");
    }

    private static CustomerDto MapToDto(Customer c)
    {
        var totalSpent = c.Orders?.Where(o => o.Status == OrderStatus.Paid).Sum(o => o.TotalAmount) ?? 0m;
        var totalOrders = c.Orders?.Count ?? 0;

        return new CustomerDto(
            c.Id,
            c.Name,
            c.Email,
            c.Phone,
            c.DocumentLast4,
            c.Status.ToString().ToLowerInvariant(),
            totalOrders,
            totalSpent,
            c.CreatedAt
        );
    }

    private static (string? Hash, string? Last4) ProcessDocument(string? doc)
    {
        if (string.IsNullOrWhiteSpace(doc)) return (null, null);

        var digitsOnly = Regex.Replace(doc, @"[^\d]", "");
        if (string.IsNullOrWhiteSpace(digitsOnly)) return (null, null);

        var last4 = digitsOnly.Length >= 4 ? digitsOnly[^4..] : digitsOnly;
        using var sha = SHA256.Create();
        var hashBytes = sha.ComputeHash(Encoding.UTF8.GetBytes(digitsOnly));
        var hash = Convert.ToHexString(hashBytes).ToLowerInvariant();

        return (hash, last4);
    }
}
