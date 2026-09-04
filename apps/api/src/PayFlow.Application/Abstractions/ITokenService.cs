using PayFlow.Domain.Entities;

namespace PayFlow.Application.Abstractions;

public record AccessTokenResult(string Token, DateTime ExpiresAt, int ExpiresInSeconds);
public record RefreshTokenResult(string RawToken, string TokenHash, DateTime ExpiresAt);

public interface ITokenService
{
    AccessTokenResult GenerateAccessToken(User user, IEnumerable<string> roles, IEnumerable<string> permissions);
    RefreshTokenResult GenerateRefreshToken();
    string HashToken(string rawToken);
}
