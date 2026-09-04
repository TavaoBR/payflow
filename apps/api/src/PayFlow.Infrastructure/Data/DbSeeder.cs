using Microsoft.EntityFrameworkCore;
using PayFlow.Application.Abstractions;
using PayFlow.Domain.Entities;
using PayFlow.Domain.Enums;
using PayFlow.Domain.ValueObjects;
using PayFlow.Infrastructure.Persistence;

namespace PayFlow.Infrastructure.Data;

public static class DbSeeder
{
    public static readonly Guid DefaultTenantId = Guid.Parse("11111111-1111-1111-1111-111111111111");
    public static readonly Guid DefaultAdminUserId = Guid.Parse("22222222-2222-2222-2222-222222222222");

    public static async Task SeedAsync(PayFlowDbContext context, IPasswordHasher passwordHasher, CancellationToken ct = default)
    {
        // 1. Check if Default Tenant exists
        var existingTenant = await context.Tenants.IgnoreQueryFilters().FirstOrDefaultAsync(t => t.Id == DefaultTenantId, ct);
        if (existingTenant == null)
        {
            var tenant = new Tenant
            {
                Id = DefaultTenantId,
                Name = "PayFlow Store",
                Slug = "payflow-store",
                Status = TenantStatus.Active,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await context.Tenants.AddAsync(tenant, ct);
            await context.SaveChangesAsync(ct);
        }

        // 2. Check if Admin User exists
        var existingUser = await context.Users.IgnoreQueryFilters().FirstOrDefaultAsync(u => u.EmailNormalized == "ADMIN@PAYFLOW.LOCAL", ct);
        if (existingUser == null)
        {
            var adminUser = new User
            {
                Id = DefaultAdminUserId,
                TenantId = DefaultTenantId,
                Name = "Administrador PayFlow",
                PasswordHash = passwordHasher.HashPassword("Admin@123456"),
                Status = UserStatus.Active,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            adminUser.SetEmail("admin@payflow.local");

            await context.Users.AddAsync(adminUser, ct);

            // Assign Owner Role
            var ownerRole = await context.Roles.FirstOrDefaultAsync(r => r.Name == "Owner", ct);
            if (ownerRole != null)
            {
                await context.UserRoles.AddAsync(new UserRole
                {
                    UserId = adminUser.Id,
                    RoleId = ownerRole.Id,
                    TenantId = DefaultTenantId
                }, ct);
            }

            await context.SaveChangesAsync(ct);
        }

        // 3. Default Checkout Branding
        var existingBranding = await context.CheckoutBrandings.IgnoreQueryFilters().FirstOrDefaultAsync(b => b.TenantId == DefaultTenantId, ct);
        if (existingBranding == null)
        {
            var branding = new CheckoutBranding
            {
                TenantId = DefaultTenantId,
                PrimaryColor = "#2563eb",
                SecondaryColor = "#0f172a",
                FontFamily = "Geist",
                RadiusPreset = "rounded-lg",
                CtaText = "Finalizar Pagamento",
                SuccessTitle = "Pagamento Confirmado!",
                SuccessMessage = "Obrigado por sua compra. Enviamos a confirmação para o seu e-mail.",
                RedirectDelaySeconds = 5,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            await context.CheckoutBrandings.AddAsync(branding, ct);
            await context.SaveChangesAsync(ct);
        }

        // 4. Demo Products
        var hasProducts = await context.Products.IgnoreQueryFilters().AnyAsync(p => p.TenantId == DefaultTenantId, ct);
        if (!hasProducts)
        {
            var p1 = new Product
            {
                Id = Guid.Parse("33333333-3333-3333-3333-333333333331"),
                TenantId = DefaultTenantId,
                Name = "Curso PayFlow Pro",
                Slug = "curso-payflow-pro",
                Sku = "SKU-CURSO-01",
                Type = ProductType.Digital,
                Description = "Acesso vitalício ao treinamento completo de pagamentos digitais.",
                PriceAmount = 199.90m,
                Currency = Money.DefaultCurrency,
                Status = ProductStatus.Active,
                StockMode = "Unlimited",
                StockQuantity = 0,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            var p2 = new Product
            {
                Id = Guid.Parse("33333333-3333-3333-3333-333333333332"),
                TenantId = DefaultTenantId,
                Name = "Consultoria Estratégica 1h",
                Slug = "consultoria-estrategica",
                Sku = "SKU-CONSULT-01",
                Type = ProductType.Service,
                Description = "Sessão individual de alinhamento técnico e financeiro.",
                PriceAmount = 450.00m,
                Currency = Money.DefaultCurrency,
                Status = ProductStatus.Active,
                StockMode = "Unlimited",
                StockQuantity = 0,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await context.Products.AddRangeAsync(p1, p2);

            // Demo Payment Link
            var link = new PaymentLink
            {
                Id = Guid.Parse("44444444-4444-4444-4444-444444444441"),
                TenantId = DefaultTenantId,
                PublicToken = "plk_demo_payflow",
                Title = "Inscrição Curso PayFlow Pro",
                Description = "Garanta sua vaga com desconto especial no PIX.",
                ProductId = p1.Id,
                FixedAmount = 199.90m,
                Currency = Money.DefaultCurrency,
                AllowedMethods = "Pix,CreditCard,Boleto",
                PixDiscountPct = 10m,
                MaxInstallments = 12,
                Status = PaymentLinkStatus.Active,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await context.PaymentLinks.AddAsync(link);
            await context.SaveChangesAsync(ct);
        }
    }
}
