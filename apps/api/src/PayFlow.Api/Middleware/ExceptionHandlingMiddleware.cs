using System.Net.Mime;
using System.Text.Json;
using PayFlow.Application.Exceptions;
using PayFlow.Contracts.Common;

namespace PayFlow.Api.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        var traceId = context.TraceIdentifier;
        int statusCode;
        ApiResponse<object> response;

        if (exception is AppException appException)
        {
            statusCode = appException.StatusCode;
            response = ApiResponse<object>.Fail(
                appException.Message,
                appException.Errors,
                traceId
            );

            _logger.LogWarning(exception, "Handled application exception {StatusCode} for request {TraceId}: {Message}",
                statusCode, traceId, appException.Message);
        }
        else
        {
            statusCode = StatusCodes.Status500InternalServerError;
            response = ApiResponse<object>.Fail(
                "Ocorreu um erro interno no servidor. Tente novamente mais tarde.",
                Array.Empty<ApiErrorItem>(),
                traceId
            );

            _logger.LogError(exception, "Unhandled exception occurred during request {TraceId}: {Message}",
                traceId, exception.Message);
        }

        context.Response.ContentType = MediaTypeNames.Application.Json;
        context.Response.StatusCode = statusCode;

        var jsonOptions = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull
        };

        await context.Response.WriteAsync(JsonSerializer.Serialize(response, jsonOptions));
    }
}
