namespace PayFlow.Contracts.Common;

public record PagedFilterParams(
    int Page = 1,
    int PerPage = 20,
    string? Search = null,
    string? Status = null,
    string? Sort = null
);
