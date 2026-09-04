using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using PayFlow.Application.Abstractions;

namespace PayFlow.Infrastructure.Security;

public class TenantContext : ITenantContext
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public TenantContext(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public Guid? CurrentTenantId
    {
        get
        {
            var httpContext = _httpContextAccessor.HttpContext;
            if (httpContext == null) return null;

            // 1. Check Claims from JWT
            var tenantClaim = httpContext.User?.FindFirst("tenant_id")?.Value
                              ?? httpContext.User?.FindFirst("tenantId")?.Value;

            if (!string.IsNullOrWhiteSpace(tenantClaim) && Guid.TryParse(tenantClaim, out var tenantIdFromClaim))
            {
                return tenantIdFromClaim;
            }

            // 2. Check X-Tenant-ID Header (fallback for development / public webhooks / integration)
            if (httpContext.Request.Headers.TryGetValue("X-Tenant-ID", out var tenantHeader) &&
                Guid.TryParse(tenantHeader.FirstOrDefault(), out var tenantIdFromHeader))
            {
                return tenantIdFromHeader;
            }

            return null;
        }
    }
}
