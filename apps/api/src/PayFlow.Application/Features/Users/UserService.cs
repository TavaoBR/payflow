using PayFlow.Application.Abstractions;
using PayFlow.Application.Exceptions;
using PayFlow.Contracts.Common;
using PayFlow.Contracts.Users;
using PayFlow.Domain.Entities;
using PayFlow.Domain.Enums;

namespace PayFlow.Application.Features.Users;

public interface IUserService
{
    Task<PagedApiResponse<UserDto>> GetUsersPagedAsync(PagedFilterParams filter, CancellationToken ct = default);
    Task<UserDto> GetUserByIdAsync(Guid id, CancellationToken ct = default);
    Task<UserDto> CreateUserAsync(CreateUserRequest request, CancellationToken ct = default);
    Task<UserDto> UpdateUserAsync(Guid id, UpdateUserRequest request, CancellationToken ct = default);
    Task<UserDto> UpdateUserStatusAsync(Guid id, UpdateUserStatusRequest request, CancellationToken ct = default);
}

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly ITenantContext _tenantContext;
    private readonly IAuditService _auditService;

    public UserService(
        IUserRepository userRepository,
        IPasswordHasher passwordHasher,
        ITenantContext tenantContext,
        IAuditService auditService)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
        _tenantContext = tenantContext;
        _auditService = auditService;
    }

    public async Task<PagedApiResponse<UserDto>> GetUsersPagedAsync(PagedFilterParams filter, CancellationToken ct = default)
    {
        var page = Math.Max(1, filter.Page);
        var perPage = Math.Clamp(filter.PerPage, 1, 100);

        var (items, total) = await _userRepository.GetUsersPagedAsync(page, perPage, filter.Search, filter.Status, ct);

        var dtos = items.Select(u => MapToDto(u)).ToList();
        return PagedApiResponse<UserDto>.Ok(dtos, page, perPage, total);
    }

    public async Task<UserDto> GetUserByIdAsync(Guid id, CancellationToken ct = default)
    {
        var user = await _userRepository.GetByIdAsync(id, ct);
        if (user == null)
        {
            throw new NotFoundException("User", id);
        }

        return MapToDto(user);
    }

    public async Task<UserDto> CreateUserAsync(CreateUserRequest request, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            throw new ValidationException("name", "user.name_required", "Nome é obrigatório.");
        if (string.IsNullOrWhiteSpace(request.Email))
            throw new ValidationException("email", "user.email_required", "E-mail é obrigatório.");
        if (string.IsNullOrWhiteSpace(request.Password) || request.Password.Length < 6)
            throw new ValidationException("password", "user.password_too_short", "Senha deve ter pelo menos 6 caracteres.");

        var existing = await _userRepository.GetByEmailAsync(request.Email.Trim(), ct);
        if (existing != null)
        {
            throw new ConflictException("user.email_exists", "Já existe um usuário cadastrado com este e-mail.");
        }

        var tenantId = _tenantContext.CurrentTenantId ?? throw new UnauthorizedException("Tenant não identificado.");

        var user = new User
        {
            TenantId = tenantId,
            Name = request.Name.Trim(),
            PasswordHash = _passwordHasher.HashPassword(request.Password),
            Status = UserStatus.Active
        };
        user.SetEmail(request.Email);

        var roleName = string.IsNullOrWhiteSpace(request.Role) ? "Analyst" : request.Role.Trim();
        var role = await _userRepository.GetRoleByNameAsync(roleName, ct);
        if (role != null)
        {
            user.UserRoles.Add(new UserRole
            {
                UserId = user.Id,
                RoleId = role.Id,
                Role = role,
                TenantId = tenantId
            });
        }

        await _userRepository.AddAsync(user, ct);
        await _userRepository.SaveChangesAsync(ct);

        await _auditService.LogAsync("user.create", "User", user.Id, new { user.Email, Role = roleName }, ct);

        return MapToDto(user);
    }

    public async Task<UserDto> UpdateUserAsync(Guid id, UpdateUserRequest request, CancellationToken ct = default)
    {
        var user = await _userRepository.GetByIdAsync(id, ct);
        if (user == null)
            throw new NotFoundException("User", id);

        if (!string.IsNullOrWhiteSpace(request.Name))
            user.Name = request.Name.Trim();

        if (!string.IsNullOrWhiteSpace(request.Role))
        {
            var role = await _userRepository.GetRoleByNameAsync(request.Role.Trim(), ct);
            if (role != null)
            {
                user.UserRoles.Clear();
                user.UserRoles.Add(new UserRole
                {
                    UserId = user.Id,
                    RoleId = role.Id,
                    Role = role,
                    TenantId = user.TenantId
                });
            }
        }

        await _userRepository.UpdateAsync(user, ct);
        await _userRepository.SaveChangesAsync(ct);

        await _auditService.LogAsync("user.update", "User", user.Id, new { user.Name, request.Role }, ct);

        return MapToDto(user);
    }

    public async Task<UserDto> UpdateUserStatusAsync(Guid id, UpdateUserStatusRequest request, CancellationToken ct = default)
    {
        var user = await _userRepository.GetByIdAsync(id, ct);
        if (user == null)
            throw new NotFoundException("User", id);

        if (Enum.TryParse<UserStatus>(request.Status, true, out var status))
        {
            user.Status = status;
            await _userRepository.UpdateAsync(user, ct);
            await _userRepository.SaveChangesAsync(ct);

            await _auditService.LogAsync("user.status_update", "User", user.Id, new { Status = status.ToString() }, ct);
        }
        else
        {
            throw new ValidationException("status", "user.invalid_status", "Status informado inválido. Use 'active' ou 'inactive'.");
        }

        return MapToDto(user);
    }

    private static UserDto MapToDto(User user)
    {
        var roles = user.UserRoles.Select(ur => ur.Role?.Name ?? string.Empty).Where(r => !string.IsNullOrEmpty(r)).Distinct().ToList();
        return new UserDto(
            user.Id,
            user.TenantId,
            user.Name,
            user.Email,
            user.Status.ToString().ToLowerInvariant(),
            roles,
            user.CreatedAt
        );
    }
}
