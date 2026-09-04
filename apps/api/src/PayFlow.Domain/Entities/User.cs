namespace PayFlow.Domain.Entities;

using PayFlow.Domain.Common;
using PayFlow.Domain.Enums;

public class User : BaseEntity, ITenantScoped, IAggregateRoot
{
    public Guid TenantId { get; set; }
    public Tenant? Tenant { get; set; }

    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string EmailNormalized { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public UserStatus Status { get; set; } = UserStatus.Active;

    public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
    public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();

    public void SetEmail(string email)
    {
        Email = email.Trim();
        EmailNormalized = email.Trim().ToUpperInvariant();
    }
}
