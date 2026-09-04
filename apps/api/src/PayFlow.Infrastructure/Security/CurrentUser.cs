using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using PayFlow.Application.Abstractions;

namespace PayFlow.Infrastructure.Security;

public class CurrentUser : ICurrentUser
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CurrentUser(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    private ClaimsPrincipal? User => _httpContextAccessor.HttpContext?.User;

    public Guid? UserId
    {
        get
        {
            var sub = User?.FindFirst(ClaimTypes.NameIdentifier)?.Value
                      ?? User?.FindFirst("sub")?.Value;

            return Guid.TryParse(sub, out var id) ? id : null;
        }
    }

    public Guid? TenantId
    {
        get
        {
            var tenantClaim = User?.FindFirst("tenant_id")?.Value
                              ?? User?.FindFirst("tenantId")?.Value;

            if (Guid.TryParse(tenantClaim, out var id))
                return id;

            // Header fallback for testing/integration
            if (_httpContextAccessor.HttpContext?.Request.Headers.TryGetValue("X-Tenant-ID", out var header) == true &&
                Guid.TryParse(header.FirstOrDefault(), out var headerId))
            {
                return headerId;
            }

            return null;
        }
    }

    public string? Email => User?.FindFirst(ClaimTypes.Email)?.Value ?? User?.FindFirst("email")?.Value;

    public bool IsAuthenticated => User?.Identity?.IsAuthenticated == true;

    public IReadOnlyList<string> Roles =>
        User?.FindAll(ClaimTypes.Role).Select(c => c.Value).Distinct().ToList()
        ?? (IReadOnlyList<string>)Array.Empty<string>();

    public IReadOnlyList<string> Permissions =>
        User?.FindAll("permission").Select(c => c.Value).Distinct().ToList()
        ?? (IReadOnlyList<string>)Array.Empty<string>();

    public bool HasPermission(string permission)
    {
        if (Roles.Contains("Owner")) return true;
        return Permissions.Contains(permission);
    }
}
