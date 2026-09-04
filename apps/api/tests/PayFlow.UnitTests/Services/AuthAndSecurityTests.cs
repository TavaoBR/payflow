using System.IdentityModel.Tokens.Jwt;
using Microsoft.Extensions.Configuration;
using PayFlow.Domain.Entities;
using PayFlow.Domain.Enums;
using PayFlow.Infrastructure.Security;
using Xunit;

namespace PayFlow.UnitTests.Services;

public class AuthAndSecurityTests
{
    [Fact]
    public void PasswordHasher_Should_Hash_And_Verify_Correctly()
    {
        var hasher = new PasswordHasher();
        var rawPassword = "SecurePassword@2026!";

        var hash = hasher.HashPassword(rawPassword);

        Assert.NotNull(hash);
        Assert.StartsWith("v1.", hash);
        Assert.True(hasher.VerifyPassword(rawPassword, hash));
        Assert.False(hasher.VerifyPassword("WrongPassword!", hash));
    }

    [Fact]
    public void TokenService_Should_Generate_Valid_Jwt_With_Expected_Claims()
    {
        var inMemorySettings = new Dictionary<string, string?>
        {
            { "Jwt:SigningKey", "TEST_SUPER_SECRET_SIGNING_KEY_1234567890_32_BYTES!" },
            { "Jwt:Issuer", "payflow-test" },
            { "Jwt:Audience", "payflow-client" }
        };

        var config = new ConfigurationBuilder()
            .AddInMemoryCollection(inMemorySettings)
            .Build();

        var tokenService = new TokenService(config);

        var user = new User
        {
            Id = Guid.NewGuid(),
            TenantId = Guid.NewGuid(),
            Name = "John Doe",
            Email = "john@example.com",
            Status = UserStatus.Active
        };

        var roles = new[] { "Admin", "Owner" };
        var permissions = new[] { "products.read", "products.write", "orders.read" };

        var tokenResult = tokenService.GenerateAccessToken(user, roles, permissions);

        Assert.NotNull(tokenResult.Token);
        Assert.True(tokenResult.ExpiresInSeconds > 0);

        var handler = new JwtSecurityTokenHandler();
        var jwt = handler.ReadJwtToken(tokenResult.Token);

        Assert.Equal("payflow-test", jwt.Issuer);
        Assert.Contains("payflow-client", jwt.Audiences);
        Assert.Equal(user.Id.ToString(), jwt.Subject);

        var emailClaim = jwt.Claims.FirstOrDefault(c => c.Type == "email" || c.Type == JwtRegisteredClaimNames.Email)?.Value;
        Assert.Equal(user.Email, emailClaim);

        var tenantClaim = jwt.Claims.FirstOrDefault(c => c.Type == "tenant_id")?.Value;
        Assert.Equal(user.TenantId.ToString(), tenantClaim);

        var roleClaims = jwt.Claims.Where(c => c.Type == "role").Select(c => c.Value).ToList();
        Assert.Contains("Admin", roleClaims);
        Assert.Contains("Owner", roleClaims);

        var permClaims = jwt.Claims.Where(c => c.Type == "permission").Select(c => c.Value).ToList();
        Assert.Contains("products.read", permClaims);
        Assert.Contains("products.write", permClaims);
    }

    [Fact]
    public void TokenService_Should_Generate_And_Hash_RefreshToken()
    {
        var config = new ConfigurationBuilder().Build();
        var tokenService = new TokenService(config);

        var refresh = tokenService.GenerateRefreshToken();

        Assert.NotNull(refresh.RawToken);
        Assert.NotNull(refresh.TokenHash);
        Assert.True(refresh.ExpiresAt > DateTime.UtcNow);

        var hashAgain = tokenService.HashToken(refresh.RawToken);
        Assert.Equal(refresh.TokenHash, hashAgain);
    }
}
