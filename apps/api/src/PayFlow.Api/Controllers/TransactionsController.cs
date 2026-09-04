using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PayFlow.Application.Features.Transactions;
using PayFlow.Contracts.Common;
using PayFlow.Contracts.Transactions;

namespace PayFlow.Api.Controllers;

[Authorize]
[Route("api/v1/transactions")]
public class TransactionsController : ApiControllerBase
{
    private readonly ITransactionService _transactionService;

    public TransactionsController(ITransactionService transactionService)
    {
        _transactionService = transactionService;
    }

    [HttpGet]
    [ProducesResponseType(typeof(PagedApiResponse<TransactionDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<PagedApiResponse<TransactionDto>>> GetTransactions(
        [FromQuery] PagedFilterParams filter,
        [FromQuery] string? method,
        CancellationToken ct)
    {
        var response = await _transactionService.GetTransactionsPagedAsync(filter, method, ct);
        return Ok(response);
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(ApiResponse<TransactionDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<TransactionDto>>> GetById(Guid id, CancellationToken ct)
    {
        var tx = await _transactionService.GetTransactionByIdAsync(id, ct);
        return OkResponse(tx);
    }

    [HttpPost("{id:guid}/refunds")]
    [ProducesResponseType(typeof(ApiResponse<RefundDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status422UnprocessableEntity)]
    public async Task<ActionResult<ApiResponse<RefundDto>>> Refund(
        Guid id,
        [FromBody] CreateRefundRequest request,
        CancellationToken ct)
    {
        var refund = await _transactionService.RefundTransactionAsync(id, request, ct);
        return OkResponse(refund, "Reembolso processado com sucesso.");
    }
}
