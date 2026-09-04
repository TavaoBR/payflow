using PayFlow.Application.Abstractions;
using PayFlow.Contracts.Dashboard;

namespace PayFlow.Application.Features.Dashboard;

public interface IDashboardService
{
    Task<DashboardSummaryResponse> GetSummaryAsync(CancellationToken ct = default);
}

public class DashboardService : IDashboardService
{
    private readonly IDashboardRepository _dashboardRepository;

    public DashboardService(IDashboardRepository dashboardRepository)
    {
        _dashboardRepository = dashboardRepository;
    }

    public async Task<DashboardSummaryResponse> GetSummaryAsync(CancellationToken ct = default)
    {
        return await _dashboardRepository.GetDashboardMetricsAsync(ct);
    }
}
