using System.IO;
using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging.Abstractions;
using PayFlow.Api.Middleware;
using PayFlow.Application.Exceptions;
using PayFlow.Contracts.Common;
using Xunit;

namespace PayFlow.UnitTests.Middleware;

public class ExceptionHandlingMiddlewareTests
{
    [Fact]
    public async Task InvokeAsync_WhenValidationExceptionThrown_Returns400WithErrors()
    {
        // Arrange
        RequestDelegate next = _ => throw new ValidationException("email", "validation.email.invalid", "E-mail inválido.");
        var middleware = new ExceptionHandlingMiddleware(next, NullLogger<ExceptionHandlingMiddleware>.Instance);

        var context = new DefaultHttpContext();
        context.TraceIdentifier = "test-trace-id";
        context.Response.Body = new MemoryStream();

        // Act
        await middleware.InvokeAsync(context);

        // Assert
        Assert.Equal(StatusCodes.Status400BadRequest, context.Response.StatusCode);

        context.Response.Body.Seek(0, SeekOrigin.Begin);
        using var reader = new StreamReader(context.Response.Body);
        var responseBody = await reader.ReadToEndAsync();

        var response = JsonSerializer.Deserialize<ApiResponse<object>>(responseBody, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        });

        Assert.NotNull(response);
        Assert.False(response.Success);
        Assert.Single(response.Errors);
        Assert.Equal("validation.email.invalid", response.Errors[0].Code);
        Assert.Equal("test-trace-id", response.TraceId);
    }

    [Fact]
    public async Task InvokeAsync_WhenUnhandledExceptionThrown_Returns500WithoutStackTrace()
    {
        // Arrange
        RequestDelegate next = _ => throw new InvalidOperationException("Internal secret database error details that must not leak!");
        var middleware = new ExceptionHandlingMiddleware(next, NullLogger<ExceptionHandlingMiddleware>.Instance);

        var context = new DefaultHttpContext();
        context.TraceIdentifier = "secret-trace-id";
        context.Response.Body = new MemoryStream();

        // Act
        await middleware.InvokeAsync(context);

        // Assert
        Assert.Equal(StatusCodes.Status500InternalServerError, context.Response.StatusCode);

        context.Response.Body.Seek(0, SeekOrigin.Begin);
        using var reader = new StreamReader(context.Response.Body);
        var responseBody = await reader.ReadToEndAsync();

        var response = JsonSerializer.Deserialize<ApiResponse<object>>(responseBody, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        });

        Assert.NotNull(response);
        Assert.False(response.Success);
        Assert.DoesNotContain("secret database error", responseBody);
        Assert.Equal("secret-trace-id", response.TraceId);
    }
}
