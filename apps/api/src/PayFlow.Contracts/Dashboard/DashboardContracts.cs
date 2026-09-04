using System.Text.Json.Serialization;

namespace PayFlow.Contracts.Dashboard;

public record MoneyDto(
    [property: JsonPropertyName("amount")] string Amount,
    [property: JsonPropertyName("currency")] string Currency
);

public record PaymentMethodBreakdownDto(
    [property: JsonPropertyName("method")] string Method,
    [property: JsonPropertyName("count")] int Count,
    [property: JsonPropertyName("percentage")] decimal Percentage,
    [property: JsonPropertyName("totalAmount")] string TotalAmount
);

public record RecentTransactionDto(
    [property: JsonPropertyName("id")] Guid Id,
    [property: JsonPropertyName("customerName")] string CustomerName,
    [property: JsonPropertyName("method")] string Method,
    [property: JsonPropertyName("status")] string Status,
    [property: JsonPropertyName("amount")] string Amount,
    [property: JsonPropertyName("currency")] string Currency,
    [property: JsonPropertyName("createdAt")] DateTime CreatedAt
);

public record RevenueChartPointDto(
    [property: JsonPropertyName("date")] string Date,
    [property: JsonPropertyName("amount")] string Amount,
    [property: JsonPropertyName("salesCount")] int SalesCount
);

public record DashboardSummaryResponse(
    [property: JsonPropertyName("totalRevenue")] MoneyDto TotalRevenue,
    [property: JsonPropertyName("totalSalesCount")] int TotalSalesCount,
    [property: JsonPropertyName("averageTicket")] MoneyDto AverageTicket,
    [property: JsonPropertyName("conversionRate")] decimal ConversionRate,
    [property: JsonPropertyName("methodBreakdown")] IReadOnlyList<PaymentMethodBreakdownDto> MethodBreakdown,
    [property: JsonPropertyName("recentTransactions")] IReadOnlyList<RecentTransactionDto> RecentTransactions,
    [property: JsonPropertyName("chartSeries")] IReadOnlyList<RevenueChartPointDto> ChartSeries
);
