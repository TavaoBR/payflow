namespace PayFlow.Application.Abstractions;

public interface ITenantContext
{
    Guid? CurrentTenantId { get; }
    bool HasTenant => CurrentTenantId.HasValue;
}
