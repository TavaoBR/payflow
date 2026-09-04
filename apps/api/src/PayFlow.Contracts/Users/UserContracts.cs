using System.Text.Json.Serialization;

namespace PayFlow.Contracts.Users;

public record UserDto(
    [property: JsonPropertyName("id")] Guid Id,
    [property: JsonPropertyName("tenantId")] Guid TenantId,
    [property: JsonPropertyName("name")] string Name,
    [property: JsonPropertyName("email")] string Email,
    [property: JsonPropertyName("status")] string Status,
    [property: JsonPropertyName("roles")] IReadOnlyList<string> Roles,
    [property: JsonPropertyName("createdAt")] DateTime CreatedAt
);

public record CreateUserRequest(
    [property: JsonPropertyName("name")] string Name,
    [property: JsonPropertyName("email")] string Email,
    [property: JsonPropertyName("password")] string Password,
    [property: JsonPropertyName("role")] string Role
);

public record UpdateUserRequest(
    [property: JsonPropertyName("name")] string Name,
    [property: JsonPropertyName("role")] string? Role
);

public record UpdateUserStatusRequest(
    [property: JsonPropertyName("status")] string Status
);
