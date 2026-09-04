using Microsoft.EntityFrameworkCore;
using PayFlow.Application.Abstractions;
using PayFlow.Domain.Common;
using PayFlow.Infrastructure.Persistence;
using Xunit;

namespace PayFlow.UnitTests.Persistence;

public class TestTenantScopedEntity : BaseEntity, ITenantScoped
{
    public Guid TenantId { get; set; }
    public string Name { get; set; } = string.Empty;
}

public class TestDbContext : PayFlowDbContext
{
    public TestDbContext(DbContextOptions<PayFlowDbContext> options, ITenantContext tenantContext)
        : base(options, tenantContext)
    {
    }

    public DbSet<TestTenantScopedEntity> TestEntities => Set<TestTenantScopedEntity>();
}

public class FakeTenantContext : ITenantContext
{
    public Guid? CurrentTenantId { get; set; }
}

public class PayFlowDbContextTests
{
    [Fact]
    public async Task SaveChangesAsync_ShouldSetCreatedAtAndUpdatedAtInUtc()
    {
        // Arrange
        var tenantId = Guid.NewGuid();
        var tenantContext = new FakeTenantContext { CurrentTenantId = tenantId };
        var options = new DbContextOptionsBuilder<PayFlowDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        using var context = new TestDbContext(options, tenantContext);
        var entity = new TestTenantScopedEntity { Name = "Test Product" };

        // Act
        context.TestEntities.Add(entity);
        await context.SaveChangesAsync();

        // Assert
        Assert.NotEqual(default, entity.CreatedAt);
        Assert.Equal(DateTimeKind.Utc, entity.CreatedAt.Kind);
        Assert.Equal(tenantId, entity.TenantId);
    }

    [Fact]
    public async Task QueryFilter_ShouldOnlyReturnEntitiesForCurrentTenant()
    {
        // Arrange
        var tenantA = Guid.NewGuid();
        var tenantB = Guid.NewGuid();
        var dbName = Guid.NewGuid().ToString();

        var tenantContext = new FakeTenantContext { CurrentTenantId = tenantA };
        var options = new DbContextOptionsBuilder<PayFlowDbContext>()
            .UseInMemoryDatabase(databaseName: dbName)
            .Options;

        using (var context = new TestDbContext(options, tenantContext))
        {
            context.TestEntities.Add(new TestTenantScopedEntity { TenantId = tenantA, Name = "Item Tenant A" });
            context.TestEntities.Add(new TestTenantScopedEntity { TenantId = tenantB, Name = "Item Tenant B" });
            await context.SaveChangesAsync();
        }

        // Act & Assert for Tenant A
        using (var contextA = new TestDbContext(options, new FakeTenantContext { CurrentTenantId = tenantA }))
        {
            var items = await contextA.TestEntities.ToListAsync();
            Assert.Single(items);
            Assert.Equal("Item Tenant A", items[0].Name);
        }

        // Act & Assert for Tenant B
        using (var contextB = new TestDbContext(options, new FakeTenantContext { CurrentTenantId = tenantB }))
        {
            var items = await contextB.TestEntities.ToListAsync();
            Assert.Single(items);
            Assert.Equal("Item Tenant B", items[0].Name);
        }
    }
}
