using Microsoft.AspNetCore.Mvc;
using PayFlow.Api.Controllers;
using PayFlow.Application.Exceptions;
using PayFlow.Application.Features.Auth;
using PayFlow.Contracts.Auth;
using PayFlow.Contracts.Common;
using Xunit;

namespace PayFlow.UnitTests.Controllers;

public class AuthControllerTests
{
    private class FakeAuthService : IAuthService
    {
        public Task<LoginResponse> LoginAsync(LoginRequest request, CancellationToken ct = default)
        {
            if (request.Email == "invalid@example.com")
            {
                throw new UnauthorizedException("Credenciais inválidas ou usuário inativo.");
            }

            var userDto = new AuthUserDto(
                Guid.NewGuid(),
                Guid.NewGuid(),
                "Admin User",
                request.Email,
                "active",
                new[] { "Admin" },
                new[] { "products.read" }
            );

            return Task.FromResult(new LoginResponse(
                "mock_access_token",
                "mock_refresh_token",
                900,
                userDto
            ));
        }

        public Task<RefreshTokenResponse> RefreshTokenAsync(RefreshTokenRequest request, CancellationToken ct = default)
        {
            return Task.FromResult(new RefreshTokenResponse("new_access_token", "new_refresh_token", 900));
        }

        public Task LogoutAsync(RefreshTokenRequest request, CancellationToken ct = default)
        {
            return Task.CompletedTask;
        }

        public Task<CurrentUserResponse> GetCurrentUserAsync(CancellationToken ct = default)
        {
            return Task.FromResult(new CurrentUserResponse(
                Guid.NewGuid(),
                Guid.NewGuid(),
                "Current User",
                "current@example.com",
                "active",
                new[] { "Admin" },
                new[] { "products.read" }
            ));
        }
    }

    [Fact]
    public async Task Login_With_Valid_Credentials_Should_Return_Ok()
    {
        var controller = new AuthController(new FakeAuthService());
        var request = new LoginRequest("admin@payflow.local", "Password123!");

        var result = await controller.Login(request, CancellationToken.None);

        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var apiResponse = Assert.IsType<ApiResponse<LoginResponse>>(okResult.Value);

        Assert.True(apiResponse.Success);
        Assert.NotNull(apiResponse.Data);
        Assert.Equal("mock_access_token", apiResponse.Data.AccessToken);
    }

    [Fact]
    public async Task Login_With_Invalid_Credentials_Should_Throw_UnauthorizedException()
    {
        var controller = new AuthController(new FakeAuthService());
        var request = new LoginRequest("invalid@example.com", "WrongPassword");

        await Assert.ThrowsAsync<UnauthorizedException>(() => controller.Login(request, CancellationToken.None));
    }

    [Fact]
    public async Task GetCurrentUser_Should_Return_Current_User_Details()
    {
        var controller = new AuthController(new FakeAuthService());

        var result = await controller.GetCurrentUser(CancellationToken.None);

        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var apiResponse = Assert.IsType<ApiResponse<CurrentUserResponse>>(okResult.Value);

        Assert.True(apiResponse.Success);
        Assert.NotNull(apiResponse.Data);
        Assert.Equal("current@example.com", apiResponse.Data.Email);
    }
}
