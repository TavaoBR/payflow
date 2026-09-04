using PayFlow.Application.Abstractions;
using PayFlow.Application.Exceptions;
using PayFlow.Contracts.Auth;
using PayFlow.Domain.Entities;
using PayFlow.Domain.Enums;

namespace PayFlow.Application.Features.Auth;

public interface IAuthService
{
    Task<LoginResponse> LoginAsync(LoginRequest request, CancellationToken ct = default);
    Task<RefreshTokenResponse> RefreshTokenAsync(RefreshTokenRequest request, CancellationToken ct = default);
    Task LogoutAsync(RefreshTokenRequest request, CancellationToken ct = default);
    Task<CurrentUserResponse> GetCurrentUserAsync(CancellationToken ct = default);
}

public class AuthService : IAuthService
{
    private readonly IAuthRepository _authRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly ITokenService _tokenService;
    private readonly ICurrentUser _currentUser;
    private readonly IAuditService _auditService;

    public AuthService(
        IAuthRepository authRepository,
        IPasswordHasher passwordHasher,
        ITokenService tokenService,
        ICurrentUser currentUser,
        IAuditService auditService)
    {
        _authRepository = authRepository;
        _passwordHasher = passwordHasher;
        _tokenService = tokenService;
        _currentUser = currentUser;
        _auditService = auditService;
    }

    public async Task<LoginResponse> LoginAsync(LoginRequest request, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
        {
            throw new ValidationException("email", "auth.invalid_input", "E-mail e senha são obrigatórios.");
        }

        var user = await _authRepository.GetUserByEmailWithRolesAsync(request.Email.Trim(), ct);
        if (user == null || user.Status != UserStatus.Active)
        {
            throw new UnauthorizedException("Credenciais inválidas ou usuário inativo.");
        }

        var isPasswordValid = _passwordHasher.VerifyPassword(request.Password, user.PasswordHash);
        if (!isPasswordValid)
        {
            throw new UnauthorizedException("Credenciais inválidas ou usuário inativo.");
        }

        var roles = user.UserRoles.Select(ur => ur.Role?.Name ?? string.Empty).Where(r => !string.IsNullOrEmpty(r)).Distinct().ToList();
        var permissions = user.UserRoles
            .SelectMany(ur => ur.Role?.RolePermissions ?? Enumerable.Empty<RolePermission>())
            .Select(rp => rp.Permission?.Code ?? string.Empty)
            .Where(p => !string.IsNullOrEmpty(p))
            .Distinct()
            .ToList();

        var accessResult = _tokenService.GenerateAccessToken(user, roles, permissions);
        var refreshResult = _tokenService.GenerateRefreshToken();

        var refreshTokenEntity = new RefreshToken
        {
            UserId = user.Id,
            TokenHash = refreshResult.TokenHash,
            ExpiresAt = refreshResult.ExpiresAt
        };

        await _authRepository.AddRefreshTokenAsync(refreshTokenEntity, ct);
        await _authRepository.SaveChangesAsync(ct);

        await _auditService.LogAsync("user.login", "User", user.Id, new { user.Email, user.TenantId }, ct);

        var userDto = new AuthUserDto(
            user.Id,
            user.TenantId,
            user.Name,
            user.Email,
            user.Status.ToString().ToLowerInvariant(),
            roles,
            permissions
        );

        return new LoginResponse(
            accessResult.Token,
            refreshResult.RawToken,
            accessResult.ExpiresInSeconds,
            userDto
        );
    }

    public async Task<RefreshTokenResponse> RefreshTokenAsync(RefreshTokenRequest request, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(request.RefreshToken))
        {
            throw new ValidationException("refreshToken", "auth.token_required", "Refresh token é obrigatório.");
        }

        var tokenHash = _tokenService.HashToken(request.RefreshToken);
        var existingToken = await _authRepository.GetRefreshTokenByHashAsync(tokenHash, ct);

        if (existingToken == null || !existingToken.IsActive)
        {
            throw new UnauthorizedException("Token de atualização inválido, expirado ou revogado.");
        }

        var user = await _authRepository.GetUserByIdWithRolesAsync(existingToken.UserId, ct);
        if (user == null || user.Status != UserStatus.Active)
        {
            throw new UnauthorizedException("Usuário associado ao token não está ativo.");
        }

        var roles = user.UserRoles.Select(ur => ur.Role?.Name ?? string.Empty).Where(r => !string.IsNullOrEmpty(r)).Distinct().ToList();
        var permissions = user.UserRoles
            .SelectMany(ur => ur.Role?.RolePermissions ?? Enumerable.Empty<RolePermission>())
            .Select(rp => rp.Permission?.Code ?? string.Empty)
            .Where(p => !string.IsNullOrEmpty(p))
            .Distinct()
            .ToList();

        var accessResult = _tokenService.GenerateAccessToken(user, roles, permissions);
        var newRefreshResult = _tokenService.GenerateRefreshToken();

        var newRefreshToken = new RefreshToken
        {
            UserId = user.Id,
            TokenHash = newRefreshResult.TokenHash,
            ExpiresAt = newRefreshResult.ExpiresAt
        };

        await _authRepository.AddRefreshTokenAsync(newRefreshToken, ct);
        await _authRepository.RevokeRefreshTokenAsync(existingToken, newRefreshToken.Id, ct);
        await _authRepository.SaveChangesAsync(ct);

        return new RefreshTokenResponse(
            accessResult.Token,
            newRefreshResult.RawToken,
            accessResult.ExpiresInSeconds
        );
    }

    public async Task LogoutAsync(RefreshTokenRequest request, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(request.RefreshToken))
        {
            return;
        }

        var tokenHash = _tokenService.HashToken(request.RefreshToken);
        var existingToken = await _authRepository.GetRefreshTokenByHashAsync(tokenHash, ct);
        if (existingToken != null && existingToken.IsActive)
        {
            await _authRepository.RevokeRefreshTokenAsync(existingToken, null, ct);
            await _authRepository.SaveChangesAsync(ct);
        }
    }

    public async Task<CurrentUserResponse> GetCurrentUserAsync(CancellationToken ct = default)
    {
        if (!_currentUser.UserId.HasValue)
        {
            throw new UnauthorizedException();
        }

        var user = await _authRepository.GetUserByIdWithRolesAsync(_currentUser.UserId.Value, ct);
        if (user == null)
        {
            throw new NotFoundException("User", _currentUser.UserId.Value);
        }

        var roles = user.UserRoles.Select(ur => ur.Role?.Name ?? string.Empty).Where(r => !string.IsNullOrEmpty(r)).Distinct().ToList();
        var permissions = user.UserRoles
            .SelectMany(ur => ur.Role?.RolePermissions ?? Enumerable.Empty<RolePermission>())
            .Select(rp => rp.Permission?.Code ?? string.Empty)
            .Where(p => !string.IsNullOrEmpty(p))
            .Distinct()
            .ToList();

        return new CurrentUserResponse(
            user.Id,
            user.TenantId,
            user.Name,
            user.Email,
            user.Status.ToString().ToLowerInvariant(),
            roles,
            permissions
        );
    }
}
