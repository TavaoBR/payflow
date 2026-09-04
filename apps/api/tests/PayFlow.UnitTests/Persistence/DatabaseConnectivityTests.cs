using Microsoft.EntityFrameworkCore;
using PayFlow.Application.Abstractions;
using PayFlow.Infrastructure.Persistence;
using Xunit;

namespace PayFlow.UnitTests.Persistence;

public class DatabaseConnectivityTests
{
    private class DummyTenantContext : ITenantContext
    {
        public Guid? CurrentTenantId { get; set; } = null;
    }

    [Fact]
    public async Task CanConnectToLocalDatabase_AndVerifyTablesAndRolesExist()
    {
        var connectionString = "Server=localhost;Port=3306;Database=playflow;User=root;Password=Guga@258!;TreatTinyAsBoolean=true;";
        var options = new DbContextOptionsBuilder<PayFlowDbContext>()
            .UseMySql(connectionString, ServerVersion.AutoDetect(connectionString))
            .Options;

        using var context = new PayFlowDbContext(options, new DummyTenantContext());

        var canConnect = await context.Database.CanConnectAsync();
        Assert.True(canConnect, "Should be able to connect to local MySQL database 'playflow'");

        var roles = await context.Roles.AsNoTracking().ToListAsync();
        Assert.NotEmpty(roles);
        Assert.Contains(roles, r => r.Name == "Owner");
        Assert.Contains(roles, r => r.Name == "Admin");
        Assert.Contains(roles, r => r.Name == "Analyst");
        Assert.Contains(roles, r => r.Name == "SupportReadOnly");

        var permissions = await context.Permissions.AsNoTracking().ToListAsync();
        Assert.Equal(14, permissions.Count);

        // Verify other tables exist and can be queried without SQL error
        Assert.NotNull(await context.Tenants.AsNoTracking().ToListAsync());
        Assert.NotNull(await context.Users.AsNoTracking().ToListAsync());
        Assert.NotNull(await context.Products.AsNoTracking().ToListAsync());
        Assert.NotNull(await context.Customers.AsNoTracking().ToListAsync());
        Assert.NotNull(await context.Orders.AsNoTracking().ToListAsync());
        Assert.NotNull(await context.OrderItems.AsNoTracking().ToListAsync());
        Assert.NotNull(await context.PaymentLinks.AsNoTracking().ToListAsync());
        Assert.NotNull(await context.CheckoutSessions.AsNoTracking().ToListAsync());
        Assert.NotNull(await context.PaymentTransactions.AsNoTracking().ToListAsync());
        Assert.NotNull(await context.Refunds.AsNoTracking().ToListAsync());
        Assert.NotNull(await context.CheckoutBrandings.AsNoTracking().ToListAsync());
        Assert.NotNull(await context.WebhookEndpoints.AsNoTracking().ToListAsync());
        Assert.NotNull(await context.WebhookEvents.AsNoTracking().ToListAsync());
        Assert.NotNull(await context.WebhookDeliveries.AsNoTracking().ToListAsync());
        Assert.NotNull(await context.AuditEntries.AsNoTracking().ToListAsync());
        Assert.NotNull(await context.IdempotencyRecords.AsNoTracking().ToListAsync());
    }
}
