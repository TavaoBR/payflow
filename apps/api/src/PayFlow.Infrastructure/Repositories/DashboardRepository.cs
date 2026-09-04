using System.Globalization;
using Microsoft.EntityFrameworkCore;
using PayFlow.Application.Abstractions;
using PayFlow.Contracts.Dashboard;
using PayFlow.Domain.Enums;
using PayFlow.Domain.ValueObjects;
using PayFlow.Infrastructure.Persistence;

namespace PayFlow.Infrastructure.Repositories;

public class DashboardRepository : IDashboardRepository
{
    private readonly PayFlowDbContext _dbContext;

    public DashboardRepository(PayFlowDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<DashboardSummaryResponse> GetDashboardMetricsAsync(CancellationToken ct = default)
    {
        var paidTx = await _dbContext.PaymentTransactions
            .Where(t => t.Status == TransactionStatus.Paid)
            .ToListAsync(ct);

        var allTx = await _dbContext.PaymentTransactions
            .Include(t => t.Order)
                .ThenInclude(o => o!.Customer)
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync(ct);

        var totalRevenue = paidTx.Sum(t => t.Amount);
        var totalSales = paidTx.Count;
        var avgTicket = totalSales > 0 ? Math.Round(totalRevenue / totalSales, 2) : 0m;
        var totalAttempts = allTx.Count;
        var conversionRate = totalAttempts > 0 ? Math.Round(((decimal)totalSales / totalAttempts) * 100m, 1) : 0m;

        // Method breakdown
        var methodGroups = allTx.GroupBy(t => t.Method).ToList();
        var breakdown = new List<PaymentMethodBreakdownDto>();

        foreach (var group in methodGroups)
        {
            var count = group.Count();
            var percentage = totalAttempts > 0 ? Math.Round(((decimal)count / totalAttempts) * 100m, 1) : 0m;
            var groupTotal = group.Where(t => t.Status == TransactionStatus.Paid).Sum(t => t.Amount);

            breakdown.Add(new PaymentMethodBreakdownDto(
                group.Key.ToString().ToLowerInvariant(),
                count,
                percentage,
                groupTotal.ToString("F2", CultureInfo.InvariantCulture)
            ));
        }

        // Recent transactions (last 10)
        var recent = allTx.Take(10).Select(t => new RecentTransactionDto(
            t.Id,
            t.Order?.Customer?.Name ?? "Cliente Avulso",
            t.Method.ToString().ToLowerInvariant(),
            t.Status.ToString().ToLowerInvariant(),
            t.Amount.ToString("F2", CultureInfo.InvariantCulture),
            t.Currency,
            t.CreatedAt
        )).ToList();

        // 7-day chart series
        var now = DateTime.UtcNow.Date;
        var chart = new List<RevenueChartPointDto>();
        for (int i = 6; i >= 0; i--)
        {
            var day = now.AddDays(-i);
            var nextDay = day.AddDays(1);
            var dayTx = paidTx.Where(t => t.CreatedAt >= day && t.CreatedAt < nextDay).ToList();

            var dayAmount = dayTx.Sum(t => t.Amount);
            chart.Add(new RevenueChartPointDto(
                day.ToString("dd/MM"),
                dayAmount.ToString("F2", CultureInfo.InvariantCulture),
                dayTx.Count
            ));
        }

        return new DashboardSummaryResponse(
            new MoneyDto(totalRevenue.ToString("F2", CultureInfo.InvariantCulture), Money.DefaultCurrency),
            totalSales,
            new MoneyDto(avgTicket.ToString("F2", CultureInfo.InvariantCulture), Money.DefaultCurrency),
            conversionRate,
            breakdown,
            recent,
            chart
        );
    }
}
