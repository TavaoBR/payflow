using System.Text.Json.Serialization;

namespace PayFlow.Contracts.Customers;

public record CustomerDto(
    [property: JsonPropertyName("id")] Guid Id,
    [property: JsonPropertyName("name")] string Name,
    [property: JsonPropertyName("email")] string Email,
    [property: JsonPropertyName("phone")] string? Phone,
    [property: JsonPropertyName("documentLast4")] string? DocumentLast4,
    [property: JsonPropertyName("status")] string Status,
    [property: JsonPropertyName("totalOrders")] int TotalOrders,
    [property: JsonPropertyName("totalSpentAmount")] decimal TotalSpentAmount,
    [property: JsonPropertyName("createdAt")] DateTime CreatedAt
);

public record CustomerOrderSummaryDto(
    [property: JsonPropertyName("id")] Guid Id,
    [property: JsonPropertyName("publicCode")] string PublicCode,
    [property: JsonPropertyName("status")] string Status,
    [property: JsonPropertyName("totalAmount")] decimal TotalAmount,
    [property: JsonPropertyName("currency")] string Currency,
    [property: JsonPropertyName("createdAt")] DateTime CreatedAt
);

public record CustomerDetailDto(
    [property: JsonPropertyName("id")] Guid Id,
    [property: JsonPropertyName("name")] string Name,
    [property: JsonPropertyName("email")] string Email,
    [property: JsonPropertyName("phone")] string? Phone,
    [property: JsonPropertyName("documentLast4")] string? DocumentLast4,
    [property: JsonPropertyName("status")] string Status,
    [property: JsonPropertyName("totalOrders")] int TotalOrders,
    [property: JsonPropertyName("totalSpentAmount")] decimal TotalSpentAmount,
    [property: JsonPropertyName("createdAt")] DateTime CreatedAt,
    [property: JsonPropertyName("orders")] IReadOnlyList<CustomerOrderSummaryDto> Orders
);

public record CreateCustomerRequest(
    [property: JsonPropertyName("name")] string Name,
    [property: JsonPropertyName("email")] string Email,
    [property: JsonPropertyName("phone")] string? Phone,
    [property: JsonPropertyName("document")] string? Document
);

public record UpdateCustomerRequest(
    [property: JsonPropertyName("name")] string Name,
    [property: JsonPropertyName("email")] string Email,
    [property: JsonPropertyName("phone")] string? Phone,
    [property: JsonPropertyName("document")] string? Document
);

public record UpdateCustomerStatusRequest(
    [property: JsonPropertyName("status")] string Status
);
