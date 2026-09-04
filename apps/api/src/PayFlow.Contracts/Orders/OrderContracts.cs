using System.Text.Json.Serialization;

namespace PayFlow.Contracts.Orders;

public record OrderItemDto(
    [property: JsonPropertyName("id")] Guid Id,
    [property: JsonPropertyName("productId")] Guid? ProductId,
    [property: JsonPropertyName("description")] string Description,
    [property: JsonPropertyName("quantity")] int Quantity,
    [property: JsonPropertyName("unitAmount")] decimal UnitAmount,
    [property: JsonPropertyName("totalAmount")] decimal TotalAmount
);

public record OrderDto(
    [property: JsonPropertyName("id")] Guid Id,
    [property: JsonPropertyName("publicCode")] string PublicCode,
    [property: JsonPropertyName("customerId")] Guid? CustomerId,
    [property: JsonPropertyName("customerName")] string? CustomerName,
    [property: JsonPropertyName("customerEmail")] string? CustomerEmail,
    [property: JsonPropertyName("status")] string Status,
    [property: JsonPropertyName("subtotalAmount")] decimal SubtotalAmount,
    [property: JsonPropertyName("discountAmount")] decimal DiscountAmount,
    [property: JsonPropertyName("totalAmount")] decimal TotalAmount,
    [property: JsonPropertyName("currency")] string Currency,
    [property: JsonPropertyName("itemCount")] int ItemCount,
    [property: JsonPropertyName("createdAt")] DateTime CreatedAt
);

public record OrderTransactionSummaryDto(
    [property: JsonPropertyName("id")] Guid Id,
    [property: JsonPropertyName("method")] string Method,
    [property: JsonPropertyName("status")] string Status,
    [property: JsonPropertyName("amount")] decimal Amount,
    [property: JsonPropertyName("currency")] string Currency,
    [property: JsonPropertyName("paidAt")] DateTime? PaidAt,
    [property: JsonPropertyName("createdAt")] DateTime CreatedAt
);

public record OrderDetailDto(
    [property: JsonPropertyName("id")] Guid Id,
    [property: JsonPropertyName("publicCode")] string PublicCode,
    [property: JsonPropertyName("customerId")] Guid? CustomerId,
    [property: JsonPropertyName("customerName")] string? CustomerName,
    [property: JsonPropertyName("customerEmail")] string? CustomerEmail,
    [property: JsonPropertyName("status")] string Status,
    [property: JsonPropertyName("subtotalAmount")] decimal SubtotalAmount,
    [property: JsonPropertyName("discountAmount")] decimal DiscountAmount,
    [property: JsonPropertyName("totalAmount")] decimal TotalAmount,
    [property: JsonPropertyName("currency")] string Currency,
    [property: JsonPropertyName("items")] IReadOnlyList<OrderItemDto> Items,
    [property: JsonPropertyName("transactions")] IReadOnlyList<OrderTransactionSummaryDto> Transactions,
    [property: JsonPropertyName("createdAt")] DateTime CreatedAt
);

public record CreateOrderItemRequest(
    [property: JsonPropertyName("productId")] Guid? ProductId,
    [property: JsonPropertyName("description")] string? Description,
    [property: JsonPropertyName("quantity")] int Quantity,
    [property: JsonPropertyName("unitAmount")] decimal? UnitAmount
);

public record CreateOrderRequest(
    [property: JsonPropertyName("customerId")] Guid? CustomerId,
    [property: JsonPropertyName("customerName")] string? CustomerName,
    [property: JsonPropertyName("customerEmail")] string? CustomerEmail,
    [property: JsonPropertyName("discountAmount")] decimal? DiscountAmount,
    [property: JsonPropertyName("items")] IReadOnlyList<CreateOrderItemRequest> Items
);
