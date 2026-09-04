using Microsoft.EntityFrameworkCore;
using PayFlow.Application.Abstractions;
using PayFlow.Domain.Entities;
using PayFlow.Infrastructure.Persistence;

namespace PayFlow.Infrastructure.Repositories;

public class CheckoutBrandingRepository : ICheckoutBrandingRepository
{
    private readonly PayFlowDbContext _dbContext;

    public CheckoutBrandingRepository(PayFlowDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<CheckoutBranding?> GetByTenantIdAsync(Guid tenantId, CancellationToken ct = default)
    {
        return await _dbContext.CheckoutBrandings
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(b => b.TenantId == tenantId, ct);
    }

    public async Task AddOrUpdateAsync(CheckoutBranding branding, CancellationToken ct = default)
    {
        var existing = await _dbContext.CheckoutBrandings
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(b => b.TenantId == branding.TenantId, ct);

        if (existing == null)
        {
            await _dbContext.CheckoutBrandings.AddAsync(branding, ct);
        }
        else
        {
            existing.LogoUrl = branding.LogoUrl;
            existing.PrimaryColor = branding.PrimaryColor;
            existing.SecondaryColor = branding.SecondaryColor;
            existing.FontFamily = branding.FontFamily;
            existing.RadiusPreset = branding.RadiusPreset;
            existing.CtaText = branding.CtaText;
            existing.SuccessTitle = branding.SuccessTitle;
            existing.SuccessMessage = branding.SuccessMessage;
            existing.RedirectUrl = branding.RedirectUrl;
            existing.RedirectDelaySeconds = branding.RedirectDelaySeconds;
            _dbContext.CheckoutBrandings.Update(existing);
        }
    }

    public Task SaveChangesAsync(CancellationToken ct = default)
    {
        return _dbContext.SaveChangesAsync(ct);
    }
}
