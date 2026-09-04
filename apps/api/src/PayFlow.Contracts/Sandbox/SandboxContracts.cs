using System.Text.Json.Serialization;

namespace PayFlow.Contracts.Sandbox;

public record SimulateTransactionRequest(
    [property: JsonPropertyName("action")] string Action,
    [property: JsonPropertyName("failureCode")] string? FailureCode
);

public record SimulateTransactionResponse(
    [property: JsonPropertyName("transactionId")] Guid TransactionId,
    [property: JsonPropertyName("previousStatus")] string PreviousStatus,
    [property: JsonPropertyName("newStatus")] string NewStatus,
    [property: JsonPropertyName("message")] string Message
);
