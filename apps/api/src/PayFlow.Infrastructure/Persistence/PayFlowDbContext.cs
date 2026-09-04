using System.Linq.Expressions;
using System.Text.RegularExpressions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using PayFlow.Application.Abstractions;
using PayFlow.Domain.Common;
using PayFlow.Domain.Entities;

namespace PayFlow.Infrastructure.Persistence;

public class PayFlowDbContext : DbContext
{
    private readonly ITenantContext _tenantContext;

    public PayFlowDbContext(
        DbContextOptions<PayFlowDbContext> options,
        ITenantContext tenantContext) : base(options)
    {
        _tenantContext = tenantContext;
    }

    public Guid? CurrentTenantId => _tenantContext.CurrentTenantId;

    public DbSet<Tenant> Tenants => Set<Tenant>();
    public DbSet<User> Users => Set<User>();
    public DbSet<Role> Roles => Set<Role>();
    public DbSet<Permission> Permissions => Set<Permission>();
    public DbSet<UserRole> UserRoles => Set<UserRole>();
    public DbSet<RolePermission> RolePermissions => Set<RolePermission>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<Customer> Customers => Set<Customer>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();
    public DbSet<PaymentLink> PaymentLinks => Set<PaymentLink>();
    public DbSet<CheckoutSession> CheckoutSessions => Set<CheckoutSession>();
    public DbSet<PaymentTransaction> PaymentTransactions => Set<PaymentTransaction>();
    public DbSet<PaymentMethodMetadata> PaymentMethodMetadatas => Set<PaymentMethodMetadata>();
    public DbSet<Refund> Refunds => Set<Refund>();
    public DbSet<CheckoutBranding> CheckoutBrandings => Set<CheckoutBranding>();
    public DbSet<WebhookEndpoint> WebhookEndpoints => Set<WebhookEndpoint>();
    public DbSet<WebhookEvent> WebhookEvents => Set<WebhookEvent>();
    public DbSet<WebhookDelivery> WebhookDeliveries => Set<WebhookDelivery>();
    public DbSet<AuditEntry> AuditEntries => Set<AuditEntry>();
    public DbSet<IdempotencyRecord> IdempotencyRecords => Set<IdempotencyRecord>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Apply entity configurations from assembly
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(PayFlowDbContext).Assembly);

        // Seed RBAC system roles and permissions
        SeedRbacData(modelBuilder);

        // Apply Snake_Case naming convention and UTC DateTime convention
        foreach (var entity in modelBuilder.Model.GetEntityTypes())
        {
            // Table name
            var tableName = entity.GetTableName();
            if (!string.IsNullOrEmpty(tableName))
            {
                entity.SetTableName(ToSnakeCase(tableName));
            }

            // Columns and Keys
            foreach (var property in entity.GetProperties())
            {
                var columnName = property.GetColumnName(StoreObjectIdentifier.Table(entity.GetTableName()!, entity.GetSchema()));
                if (!string.IsNullOrEmpty(columnName))
                {
                    property.SetColumnName(ToSnakeCase(columnName));
                }

                // UTC DateTime convention
                if (property.ClrType == typeof(DateTime) || property.ClrType == typeof(DateTime?))
                {
                    property.SetValueConverter(new Microsoft.EntityFrameworkCore.Storage.ValueConversion.ValueConverter<DateTime, DateTime>(
                        v => v.Kind == DateTimeKind.Utc ? v : DateTime.SpecifyKind(v, DateTimeKind.Utc),
                        v => DateTime.SpecifyKind(v, DateTimeKind.Utc)
                    ));
                }
            }

            foreach (var key in entity.GetKeys())
            {
                var keyName = key.GetName();
                if (!string.IsNullOrEmpty(keyName))
                {
                    key.SetName(ToSnakeCase(keyName));
                }
            }

            foreach (var foreignKey in entity.GetForeignKeys())
            {
                var fkName = foreignKey.GetConstraintName();
                if (!string.IsNullOrEmpty(fkName))
                {
                    foreignKey.SetConstraintName(ToSnakeCase(fkName));
                }
            }

            foreach (var index in entity.GetIndexes())
            {
                var indexName = index.GetDatabaseName();
                if (!string.IsNullOrEmpty(indexName))
                {
                    index.SetDatabaseName(ToSnakeCase(indexName));
                }
            }

            // Global Query Filter for ITenantScoped entities
            if (typeof(ITenantScoped).IsAssignableFrom(entity.ClrType))
            {
                var parameter = Expression.Parameter(entity.ClrType, "e");
                var property = Expression.Property(parameter, nameof(ITenantScoped.TenantId));
                var tenantIdValue = Expression.Property(Expression.Constant(this), nameof(CurrentTenantId));

                // e.TenantId == CurrentTenantId
                var filter = Expression.Lambda(
                    Expression.Equal(
                        Expression.Convert(property, typeof(Guid?)),
                        tenantIdValue
                    ),
                    parameter
                );

                modelBuilder.Entity(entity.ClrType).HasQueryFilter(filter);
            }
        }

        // Dependent entities query filters for tenant isolation
        modelBuilder.Entity<OrderItem>()
            .HasQueryFilter(e => (Guid?)e.Order!.TenantId == CurrentTenantId);

        modelBuilder.Entity<PaymentMethodMetadata>()
            .HasQueryFilter(e => (Guid?)e.Transaction!.TenantId == CurrentTenantId);

        modelBuilder.Entity<RefreshToken>()
            .HasQueryFilter(e => (Guid?)e.User!.TenantId == CurrentTenantId);

        modelBuilder.Entity<WebhookDelivery>()
            .HasQueryFilter(e => (Guid?)e.Endpoint!.TenantId == CurrentTenantId);
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        var entries = ChangeTracker.Entries<BaseEntity>();
        var utcNow = DateTime.UtcNow;

        foreach (var entry in entries)
        {
            if (entry.State == EntityState.Added)
            {
                entry.Entity.CreatedAt = utcNow;
                entry.Entity.UpdatedAt = utcNow;

                // Automatically assign TenantId if entity is ITenantScoped and not set
                if (entry.Entity is ITenantScoped tenantScoped && _tenantContext.CurrentTenantId.HasValue)
                {
                    var property = entry.Property(nameof(ITenantScoped.TenantId));
                    if (property.CurrentValue == null || (Guid)property.CurrentValue == Guid.Empty)
                    {
                        property.CurrentValue = _tenantContext.CurrentTenantId.Value;
                    }
                }
            }
            else if (entry.State == EntityState.Modified)
            {
                entry.Entity.UpdatedAt = utcNow;
            }
        }

        return base.SaveChangesAsync(cancellationToken);
    }

    private static void SeedRbacData(ModelBuilder modelBuilder)
    {
        var ownerRoleId = Guid.Parse("00000000-0000-0000-0000-000000000001");
        var adminRoleId = Guid.Parse("00000000-0000-0000-0000-000000000002");
        var analystRoleId = Guid.Parse("00000000-0000-0000-0000-000000000003");
        var supportRoleId = Guid.Parse("00000000-0000-0000-0000-000000000004");
        var baseDate = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc);

        var roles = new[]
        {
            new Role { Id = ownerRoleId, Name = "Owner", Description = "Administrador total do tenant", IsSystemRole = true, CreatedAt = baseDate, UpdatedAt = baseDate },
            new Role { Id = adminRoleId, Name = "Admin", Description = "Gestão operacional e configuração", IsSystemRole = true, CreatedAt = baseDate, UpdatedAt = baseDate },
            new Role { Id = analystRoleId, Name = "Analyst", Description = "Leitura e operações comerciais limitadas", IsSystemRole = true, CreatedAt = baseDate, UpdatedAt = baseDate },
            new Role { Id = supportRoleId, Name = "SupportReadOnly", Description = "Leitura operacional sem mutações financeiras", IsSystemRole = true, CreatedAt = baseDate, UpdatedAt = baseDate }
        };

        var permissionsData = new (string Code, string Description)[]
        {
            ("dashboard.read", "Visualizar painel e métricas gerais"),
            ("products.read", "Visualizar catálogo de produtos"),
            ("products.write", "Criar e gerenciar produtos"),
            ("customers.read", "Visualizar lista e detalhes de clientes"),
            ("customers.write", "Criar e atualizar clientes"),
            ("orders.read", "Visualizar pedidos"),
            ("orders.write", "Gerenciar e criar pedidos"),
            ("transactions.read", "Visualizar transações financeiras"),
            ("transactions.refund", "Executar estornos e reembolsos"),
            ("payment_links.write", "Gerenciar links de pagamento"),
            ("checkout_settings.write", "Configurar regras e identidade do checkout"),
            ("users.manage", "Gerenciar usuários e permissões"),
            ("webhooks.manage", "Gerenciar endpoints e entregas de webhooks"),
            ("audit.read", "Visualizar trilha de auditoria")
        };

        var permissions = new List<Permission>();
        var rolePermissions = new List<RolePermission>();

        for (var i = 0; i < permissionsData.Length; i++)
        {
            var permId = Guid.Parse($"00000000-0000-0000-0001-{i + 1:D12}");
            var (code, desc) = permissionsData[i];

            permissions.Add(new Permission
            {
                Id = permId,
                Code = code,
                Description = desc,
                CreatedAt = baseDate,
                UpdatedAt = baseDate
            });

            // Owner gets all
            rolePermissions.Add(new RolePermission { RoleId = ownerRoleId, PermissionId = permId });

            // Admin gets almost all
            rolePermissions.Add(new RolePermission { RoleId = adminRoleId, PermissionId = permId });

            // Analyst gets read permissions + orders/payment_links
            if (code.EndsWith(".read") || code == "payment_links.write")
            {
                rolePermissions.Add(new RolePermission { RoleId = analystRoleId, PermissionId = permId });
            }

            // SupportReadOnly gets read permissions only
            if (code.EndsWith(".read"))
            {
                rolePermissions.Add(new RolePermission { RoleId = supportRoleId, PermissionId = permId });
            }
        }

        modelBuilder.Entity<Role>().HasData(roles);
        modelBuilder.Entity<Permission>().HasData(permissions);
        modelBuilder.Entity<RolePermission>().HasData(rolePermissions);
    }

    private static string ToSnakeCase(string input)
    {
        if (string.IsNullOrEmpty(input)) return input;
        return Regex.Replace(input, @"([a-z0-9])([A-Z])", "$1_$2").ToLowerInvariant();
    }
}
