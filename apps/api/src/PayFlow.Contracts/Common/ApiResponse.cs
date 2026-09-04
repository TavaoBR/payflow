using System.Text.Json.Serialization;

namespace PayFlow.Contracts.Common;

public record ApiErrorItem(
    [property: JsonPropertyName("code")] string Code,
    [property: JsonPropertyName("field")] string? Field,
    [property: JsonPropertyName("message")] string Message
);

public record PagedMeta(
    [property: JsonPropertyName("page")] int Page,
    [property: JsonPropertyName("perPage")] int PerPage,
    [property: JsonPropertyName("total")] long Total,
    [property: JsonPropertyName("lastPage")] int LastPage
);

public record ApiResponse<T>
{
    [JsonPropertyName("success")]
    public bool Success { get; init; }

    [JsonPropertyName("data")]
    public T? Data { get; init; }

    [JsonPropertyName("message")]
    public string? Message { get; init; }

    [JsonPropertyName("errors")]
    public IReadOnlyList<ApiErrorItem> Errors { get; init; } = Array.Empty<ApiErrorItem>();

    [JsonPropertyName("traceId")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? TraceId { get; init; }

    public static ApiResponse<T> Ok(T data, string? message = null) => new()
    {
        Success = true,
        Data = data,
        Message = message,
        Errors = Array.Empty<ApiErrorItem>()
    };

    public static ApiResponse<T> Fail(string message, IEnumerable<ApiErrorItem>? errors = null, string? traceId = null) => new()
    {
        Success = false,
        Data = default,
        Message = message,
        Errors = errors?.ToList() ?? new List<ApiErrorItem>(),
        TraceId = traceId
    };
}

public record PagedApiResponse<T>
{
    [JsonPropertyName("success")]
    public bool Success { get; init; }

    [JsonPropertyName("data")]
    public IReadOnlyList<T> Data { get; init; } = Array.Empty<T>();

    [JsonPropertyName("meta")]
    public PagedMeta Meta { get; init; } = null!;

    [JsonPropertyName("message")]
    public string? Message { get; init; }

    [JsonPropertyName("errors")]
    public IReadOnlyList<ApiErrorItem> Errors { get; init; } = Array.Empty<ApiErrorItem>();

    [JsonPropertyName("traceId")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? TraceId { get; init; }

    public static PagedApiResponse<T> Ok(IEnumerable<T> items, int page, int perPage, long total, string? message = null)
    {
        var list = items.ToList();
        var lastPage = perPage > 0 ? (int)Math.Ceiling(total / (double)perPage) : 1;
        return new PagedApiResponse<T>
        {
            Success = true,
            Data = list,
            Meta = new PagedMeta(page, perPage, total, Math.Max(1, lastPage)),
            Message = message,
            Errors = Array.Empty<ApiErrorItem>()
        };
    }
}
