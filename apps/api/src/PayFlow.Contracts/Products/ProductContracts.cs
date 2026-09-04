using System.Text.Json.Serialization;

namespace PayFlow.Contracts.Products;

public record ProductDto(
    [property: JsonPropertyName("id")] Guid Id,
    [property: JsonPropertyName("name")] string Name,
    [property: JsonPropertyName("slug")] string Slug,
    [property: JsonPropertyName("sku")] string Sku,
    [property: JsonPropertyName("type")] string Type,
    [property: JsonPropertyName("description")] string? Description,
    [property: JsonPropertyName("priceAmount")] decimal PriceAmount,
    [property: JsonPropertyName("priceFormatted")] string PriceFormatted,
    [property: JsonPropertyName("currency")] string Currency,
    [property: JsonPropertyName("status")] string Status,
    [property: JsonPropertyName("stockMode")] string StockMode,
    [property: JsonPropertyName("stockQuantity")] int StockQuantity,
    [property: JsonPropertyName("imageUrl")] string? ImageUrl,
    [property: JsonPropertyName("createdAt")] DateTime CreatedAt,
    [property: JsonPropertyName("updatedAt")] DateTime UpdatedAt
);

public record CreateProductRequest(
    [property: JsonPropertyName("name")] string Name,
    [property: JsonPropertyName("sku")] string? Sku,
    [property: JsonPropertyName("type")] string? Type,
    [property: JsonPropertyName("description")] string? Description,
    [property: JsonPropertyName("priceAmount")] decimal PriceAmount,
    [property: JsonPropertyName("currency")] string? Currency,
    [property: JsonPropertyName("status")] string? Status,
    [property: JsonPropertyName("stockMode")] string? StockMode,
    [property: JsonPropertyName("stockQuantity")] int? StockQuantity,
    [property: JsonPropertyName("imageUrl")] string? ImageUrl
);

public record UpdateProductRequest(
    [property: JsonPropertyName("name")] string Name,
    [property: JsonPropertyName("sku")] string? Sku,
    [property: JsonPropertyName("type")] string? Type,
    [property: JsonPropertyName("description")] string? Description,
    [property: JsonPropertyName("priceAmount")] decimal PriceAmount,
    [property: JsonPropertyName("currency")] string? Currency,
    [property: JsonPropertyName("status")] string? Status,
    [property: JsonPropertyName("stockMode")] string? StockMode,
    [property: JsonPropertyName("stockQuantity")] int? StockQuantity,
    [property: JsonPropertyName("imageUrl")] string? ImageUrl
);

public record UpdateProductStatusRequest(
    [property: JsonPropertyName("status")] string Status
);
