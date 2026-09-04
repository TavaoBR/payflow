using PayFlow.Domain.Entities;
using PayFlow.Domain.Enums;
using Xunit;

namespace PayFlow.UnitTests.Services;

public class OrderCalculationTests
{
    [Fact]
    public void Order_Should_Calculate_Totals_And_Discounts_Accurately()
    {
        var order = new Order
        {
            Id = Guid.NewGuid(),
            TenantId = Guid.NewGuid(),
            Status = OrderStatus.PendingPayment,
            PublicCode = "ORD-TEST-001"
        };

        // Add Item 1: 2 x 50.00 = 100.00
        order.AddItem(Guid.NewGuid(), "Produto A", 2, 50.00m);
        // Add Item 2: 3 x 20.00 = 60.00
        order.AddItem(Guid.NewGuid(), "Produto B", 3, 20.00m);

        Assert.Equal(160.00m, order.SubtotalAmount);
        Assert.Equal(0m, order.DiscountAmount);
        Assert.Equal(160.00m, order.TotalAmount);

        // Apply discount: 30.00 -> total = 130.00
        order.ApplyDiscount(30.00m);
        Assert.Equal(160.00m, order.SubtotalAmount);
        Assert.Equal(30.00m, order.DiscountAmount);
        Assert.Equal(130.00m, order.TotalAmount);

        // Applying excessive discount caps at Subtotal
        order.ApplyDiscount(250.00m);
        Assert.Equal(160.00m, order.DiscountAmount);
        Assert.Equal(0m, order.TotalAmount);
    }
}
