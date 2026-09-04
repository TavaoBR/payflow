namespace PayFlow.Application.Abstractions;

public interface IAuditService
{
    Task LogAsync(string action, string entityType, Guid? entityId, object? metadata = null, CancellationToken ct = default);
}
