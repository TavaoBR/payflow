using PayFlow.Contracts.Dashboard;
using PayFlow.Domain.Entities;

namespace PayFlow.Application.Abstractions;

public interface IAuthRepository
{
    Task<User?> GetUserByEmailWithRolesAsync(string email, CancellationToken ct = default);
    Task<User?> GetUserByIdWithRolesAsync(Guid userId, CancellationToken ct = default);
    Task<RefreshToken?> GetRefreshTokenByHashAsync(string tokenHash, CancellationToken ct = default);
    Task AddRefreshTokenAsync(RefreshToken refreshToken, CancellationToken ct = default);
    Task RevokeRefreshTokenAsync(RefreshToken refreshToken, Guid? replacedById = null, CancellationToken ct = default);
    Task SaveChangesAsync(CancellationToken ct = default);
}

public interface IUserRepository
{
    Task<(IReadOnlyList<User> Items, long Total)> GetUsersPagedAsync(int page, int perPage, string? search, string? status, CancellationToken ct = default);
    Task<User?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<User?> GetByEmailAsync(string email, CancellationToken ct = default);
    Task<Role?> GetRoleByNameAsync(string roleName, CancellationToken ct = default);
    Task AddAsync(User user, CancellationToken ct = default);
    Task UpdateAsync(User user, CancellationToken ct = default);
    Task SaveChangesAsync(CancellationToken ct = default);
}

public interface IProductRepository
{
    Task<(IReadOnlyList<Product> Items, long Total)> GetProductsPagedAsync(int page, int perPage, string? search, string? type, string? status, string? sort, CancellationToken ct = default);
    Task<Product?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<Product?> GetBySlugAsync(string slug, CancellationToken ct = default);
    Task AddAsync(Product product, CancellationToken ct = default);
    Task UpdateAsync(Product product, CancellationToken ct = default);
    Task DeleteAsync(Product product, CancellationToken ct = default);
    Task SaveChangesAsync(CancellationToken ct = default);
}

public interface ICustomerRepository
{
    Task<(IReadOnlyList<Customer> Items, long Total)> GetCustomersPagedAsync(int page, int perPage, string? search, string? status, CancellationToken ct = default);
    Task<Customer?> GetByIdWithOrdersAsync(Guid id, CancellationToken ct = default);
    Task<Customer?> GetByEmailAsync(string email, CancellationToken ct = default);
    Task AddAsync(Customer customer, CancellationToken ct = default);
    Task UpdateAsync(Customer customer, CancellationToken ct = default);
    Task SaveChangesAsync(CancellationToken ct = default);
}

public interface IOrderRepository
{
    Task<(IReadOnlyList<Order> Items, long Total)> GetOrdersPagedAsync(int page, int perPage, string? status, Guid? customerId, CancellationToken ct = default);
    Task<Order?> GetByIdWithDetailsAsync(Guid id, CancellationToken ct = default);
    Task<Order?> GetByPublicCodeAsync(string publicCode, CancellationToken ct = default);
    Task AddAsync(Order order, CancellationToken ct = default);
    Task UpdateAsync(Order order, CancellationToken ct = default);
    Task SaveChangesAsync(CancellationToken ct = default);
}

public interface ITransactionRepository
{
    Task<(IReadOnlyList<PaymentTransaction> Items, long Total)> GetTransactionsPagedAsync(int page, int perPage, string? status, string? method, CancellationToken ct = default);
    Task<PaymentTransaction?> GetByIdWithDetailsAsync(Guid id, CancellationToken ct = default);
    Task<PaymentTransaction?> GetByIdempotencyKeyAsync(string idempotencyKey, CancellationToken ct = default);
    Task AddAsync(PaymentTransaction transaction, CancellationToken ct = default);
    Task UpdateAsync(PaymentTransaction transaction, CancellationToken ct = default);
    Task AddRefundAsync(Refund refund, CancellationToken ct = default);
    Task SaveChangesAsync(CancellationToken ct = default);
}

public interface IPaymentLinkRepository
{
    Task<(IReadOnlyList<PaymentLink> Items, long Total)> GetPaymentLinksPagedAsync(int page, int perPage, string? status, CancellationToken ct = default);
    Task<PaymentLink?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<PaymentLink?> GetByPublicTokenAsync(string publicToken, CancellationToken ct = default);
    Task AddAsync(PaymentLink link, CancellationToken ct = default);
    Task UpdateAsync(PaymentLink link, CancellationToken ct = default);
    Task SaveChangesAsync(CancellationToken ct = default);
}

public interface ICheckoutSessionRepository
{
    Task<CheckoutSession?> GetByIdWithDetailsAsync(Guid id, CancellationToken ct = default);
    Task<CheckoutSession?> GetByPublicTokenAsync(string publicToken, CancellationToken ct = default);
    Task AddAsync(CheckoutSession session, CancellationToken ct = default);
    Task UpdateAsync(CheckoutSession session, CancellationToken ct = default);
    Task SaveChangesAsync(CancellationToken ct = default);
}

public interface ICheckoutBrandingRepository
{
    Task<CheckoutBranding?> GetByTenantIdAsync(Guid tenantId, CancellationToken ct = default);
    Task AddOrUpdateAsync(CheckoutBranding branding, CancellationToken ct = default);
    Task SaveChangesAsync(CancellationToken ct = default);
}

public interface IWebhookRepository
{
    Task<IReadOnlyList<WebhookEndpoint>> GetEndpointsAsync(CancellationToken ct = default);
    Task<WebhookEndpoint?> GetEndpointByIdAsync(Guid id, CancellationToken ct = default);
    Task AddEndpointAsync(WebhookEndpoint endpoint, CancellationToken ct = default);
    Task UpdateEndpointAsync(WebhookEndpoint endpoint, CancellationToken ct = default);
    Task DeleteEndpointAsync(WebhookEndpoint endpoint, CancellationToken ct = default);
    Task AddEventAsync(WebhookEvent evt, CancellationToken ct = default);
    Task SaveChangesAsync(CancellationToken ct = default);
}

public interface IAuditRepository
{
    Task<(IReadOnlyList<AuditEntry> Items, long Total)> GetAuditEntriesPagedAsync(int page, int perPage, CancellationToken ct = default);
    Task AddAsync(AuditEntry entry, CancellationToken ct = default);
    Task SaveChangesAsync(CancellationToken ct = default);
}

public interface IDashboardRepository
{
    Task<DashboardSummaryResponse> GetDashboardMetricsAsync(CancellationToken ct = default);
}
