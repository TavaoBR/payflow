using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using PayFlow.Application.Abstractions;
using PayFlow.Application.Features.Audit;
using PayFlow.Application.Features.Auth;
using PayFlow.Application.Features.CheckoutSettings;
using PayFlow.Application.Features.Customers;
using PayFlow.Application.Features.Dashboard;
using PayFlow.Application.Features.Orders;
using PayFlow.Application.Features.PaymentLinks;
using PayFlow.Application.Features.Products;
using PayFlow.Application.Features.PublicCheckout;
using PayFlow.Application.Features.Sandbox;
using PayFlow.Application.Features.Transactions;
using PayFlow.Application.Features.Users;
using PayFlow.Application.Features.Webhooks;
using PayFlow.Infrastructure.Audit;
using PayFlow.Infrastructure.Payments;
using PayFlow.Infrastructure.Persistence;
using PayFlow.Infrastructure.Repositories;
using PayFlow.Infrastructure.Security;
using PayFlow.Infrastructure.Webhooks;

namespace PayFlow.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddHttpContextAccessor();
        services.AddScoped<ITenantContext, TenantContext>();
        services.AddScoped<ICurrentUser, CurrentUser>();

        // Database
        var connectionString = configuration.GetConnectionString("Default")
            ?? "Server=localhost;Port=3306;Database=playflow;User=root;Password=Guga@258!;TreatTinyAsBoolean=true;";

        ServerVersion serverVersion;
        try
        {
            serverVersion = ServerVersion.AutoDetect(connectionString);
        }
        catch
        {
            serverVersion = new MySqlServerVersion(new Version(8, 0, 36));
        }

        services.AddDbContext<PayFlowDbContext>(options =>
        {
            options.UseMySql(connectionString, serverVersion, mySqlOptions =>
            {
                mySqlOptions.MigrationsAssembly(typeof(PayFlowDbContext).Assembly.FullName);
                mySqlOptions.EnableRetryOnFailure(maxRetryCount: 3, maxRetryDelay: TimeSpan.FromSeconds(5), errorNumbersToAdd: null);
            });
        });

        // Security & Auth Services
        services.AddSingleton<IPasswordHasher, PasswordHasher>();
        services.AddSingleton<ITokenService, TokenService>();
        services.AddScoped<IPaymentGateway, MockPaymentGateway>();
        services.AddScoped<IAuditService, AuditService>();
        services.AddScoped<IWebhookDispatcher, WebhookDispatcher>();

        // JWT Authentication Configuration
        var signingKey = configuration["Jwt:SigningKey"] ?? "CHANGE_ME_DEV_SECRET_MIN_32_CHARS_LONG_KEY";
        var issuer = configuration["Jwt:Issuer"] ?? "payflow-api";
        var audience = configuration["Jwt:Audience"] ?? "payflow-web";

        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.RequireHttpsMetadata = false;
            options.SaveToken = true;
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(signingKey)),
                ValidateIssuer = true,
                ValidIssuer = issuer,
                ValidateAudience = true,
                ValidAudience = audience,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            };
        });

        // Repositories
        services.AddScoped<IAuthRepository, AuthRepository>();
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IProductRepository, ProductRepository>();
        services.AddScoped<ICustomerRepository, CustomerRepository>();
        services.AddScoped<IOrderRepository, OrderRepository>();
        services.AddScoped<ITransactionRepository, TransactionRepository>();
        services.AddScoped<IPaymentLinkRepository, PaymentLinkRepository>();
        services.AddScoped<ICheckoutSessionRepository, CheckoutSessionRepository>();
        services.AddScoped<ICheckoutBrandingRepository, CheckoutBrandingRepository>();
        services.AddScoped<IWebhookRepository, WebhookRepository>();
        services.AddScoped<IAuditRepository, AuditRepository>();
        services.AddScoped<IDashboardRepository, DashboardRepository>();

        // Application Services
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IDashboardService, DashboardService>();
        services.AddScoped<IProductService, ProductService>();
        services.AddScoped<ICustomerService, CustomerService>();
        services.AddScoped<IOrderService, OrderService>();
        services.AddScoped<ITransactionService, TransactionService>();
        services.AddScoped<IPaymentLinkService, PaymentLinkService>();
        services.AddScoped<ICheckoutSettingsService, CheckoutSettingsService>();
        services.AddScoped<IPublicCheckoutService, PublicCheckoutService>();
        services.AddScoped<ISandboxService, SandboxService>();
        services.AddScoped<IWebhookService, WebhookService>();
        services.AddScoped<IAuditLogService, AuditLogService>();

        return services;
    }
}
