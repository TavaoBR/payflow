using PayFlow.Contracts.Common;

namespace PayFlow.Application.Exceptions;

public abstract class AppException : Exception
{
    public abstract int StatusCode { get; }
    public IReadOnlyList<ApiErrorItem> Errors { get; }

    protected AppException(string message, IEnumerable<ApiErrorItem>? errors = null)
        : base(message)
    {
        Errors = errors?.ToList() ?? new List<ApiErrorItem>();
    }
}

public class ValidationException : AppException
{
    public override int StatusCode => 400;

    public ValidationException(string message, IEnumerable<ApiErrorItem>? errors = null)
        : base(message, errors)
    {
    }

    public ValidationException(string field, string code, string message)
        : base(message, new[] { new ApiErrorItem(code, field, message) })
    {
    }
}

public class NotFoundException : AppException
{
    public override int StatusCode => 404;

    public NotFoundException(string resourceName, object key)
        : base($"Recurso '{resourceName}' com identificador '{key}' não foi encontrado.",
            new[] { new ApiErrorItem($"{resourceName.ToLowerInvariant()}.not_found", null, $"Recurso '{resourceName}' não encontrado.") })
    {
    }

    public NotFoundException(string message)
        : base(message, new[] { new ApiErrorItem("resource.not_found", null, message) })
    {
    }
}

public class ConflictException : AppException
{
    public override int StatusCode => 409;

    public ConflictException(string code, string message)
        : base(message, new[] { new ApiErrorItem(code, null, message) })
    {
    }
}

public class UnauthorizedException : AppException
{
    public override int StatusCode => 401;

    public UnauthorizedException(string message = "Usuário não autenticado.")
        : base(message, new[] { new ApiErrorItem("auth.unauthorized", null, message) })
    {
    }
}

public class ForbiddenException : AppException
{
    public override int StatusCode => 403;

    public ForbiddenException(string message = "Acesso negado para o recurso solicitado.")
        : base(message, new[] { new ApiErrorItem("auth.forbidden", null, message) })
    {
    }
}

public class BusinessRuleException : AppException
{
    public override int StatusCode => 422;

    public BusinessRuleException(string code, string message)
        : base(message, new[] { new ApiErrorItem(code, null, message) })
    {
    }
}
