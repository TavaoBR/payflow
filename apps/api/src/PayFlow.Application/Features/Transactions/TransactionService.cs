using PayFlow.Application.Abstractions;
using PayFlow.Application.Exceptions;
using PayFlow.Contracts.Common;
using PayFlow.Contracts.Transactions;
using PayFlow.Domain.Entities;
using PayFlow.Domain.Enums;

namespace PayFlow.Application.Features.Transactions;

public interface ITransactionService
{
    Task<PagedApiResponse<TransactionDto>> GetTransactionsPagedAsync(PagedFilterParams filter, string? method, CancellationToken ct = default);
    Task<TransactionDto> GetTransactionByIdAsync(Guid id, CancellationToken ct = default);
    Task<RefundDto> RefundTransactionAsync(Guid transactionId, CreateRefundRequest request, CancellationToken ct = default);
}

public class TransactionService : ITransactionService
{
    private readonly ITransactionRepository _transactionRepository;
    private readonly IPaymentGateway _paymentGateway;
    private readonly IAuditService _auditService;
    private readonly IWebhookDispatcher _webhookDispatcher;
    private readonly ITenantContext _tenantContext;

    public TransactionService(
        ITransactionRepository transactionRepository,
        IPaymentGateway paymentGateway,
        IAuditService auditService,
        IWebhookDispatcher webhookDispatcher,
        ITenantContext tenantContext)
    {
        _transactionRepository = transactionRepository;
        _paymentGateway = paymentGateway;
        _auditService = auditService;
        _webhookDispatcher = webhookDispatcher;
        _tenantContext = tenantContext;
    }

    public async Task<PagedApiResponse<TransactionDto>> GetTransactionsPagedAsync(PagedFilterParams filter, string? method, CancellationToken ct = default)
    {
        var page = Math.Max(1, filter.Page);
        var perPage = Math.Clamp(filter.PerPage, 1, 100);

        var (items, total) = await _transactionRepository.GetTransactionsPagedAsync(page, perPage, filter.Status, method, ct);

        var dtos = items.Select(MapToDto).ToList();
        return PagedApiResponse<TransactionDto>.Ok(dtos, page, perPage, total);
    }

    public async Task<TransactionDto> GetTransactionByIdAsync(Guid id, CancellationToken ct = default)
    {
        var tx = await _transactionRepository.GetByIdWithDetailsAsync(id, ct);
        if (tx == null)
            throw new NotFoundException("PaymentTransaction", id);

        return MapToDto(tx);
    }

    public async Task<RefundDto> RefundTransactionAsync(Guid transactionId, CreateRefundRequest request, CancellationToken ct = default)
    {
        var tx = await _transactionRepository.GetByIdWithDetailsAsync(transactionId, ct);
        if (tx == null)
            throw new NotFoundException("PaymentTransaction", transactionId);

        if (tx.Status != TransactionStatus.Paid && tx.Status != TransactionStatus.PartiallyRefunded)
        {
            throw new BusinessRuleException("refund.invalid_state", "Apenas transações pagas podem ser reembolsadas.");
        }

        var alreadyRefunded = tx.Refunds.Where(r => r.Status == RefundStatus.Approved).Sum(r => r.Amount);
        var availableForRefund = tx.Amount - alreadyRefunded;

        var refundAmount = request.Amount ?? availableForRefund;
        if (refundAmount <= 0)
        {
            throw new ValidationException("amount", "refund.invalid_amount", "Valor de reembolso deve ser maior que zero.");
        }

        if (refundAmount > availableForRefund)
        {
            throw new BusinessRuleException("refund.exceeds_available", $"Valor solicitado ({refundAmount:C}) excede o saldo disponível para reembolso ({availableForRefund:C}).");
        }

        var reason = string.IsNullOrWhiteSpace(request.Reason) ? "Reembolso solicitado pelo lojista" : request.Reason.Trim();
        var idempotencyKey = string.IsNullOrWhiteSpace(request.IdempotencyKey) ? Guid.NewGuid().ToString() : request.IdempotencyKey.Trim();

        var gatewayResult = await _paymentGateway.ProcessRefundAsync(tx, refundAmount, reason, ct);

        var refund = new Refund
        {
            TenantId = tx.TenantId,
            PaymentTransactionId = tx.Id,
            Amount = refundAmount,
            Status = gatewayResult.Status,
            Reason = reason,
            IdempotencyKey = idempotencyKey,
            ProcessedAt = gatewayResult.Success ? DateTime.UtcNow : null
        };

        await _transactionRepository.AddRefundAsync(refund, ct);

        if (gatewayResult.Success)
        {
            var newTotalRefunded = alreadyRefunded + refundAmount;
            if (newTotalRefunded >= tx.Amount)
            {
                tx.Status = TransactionStatus.Refunded;
                if (tx.Order != null) tx.Order.Status = OrderStatus.Cancelled;
            }
            else
            {
                tx.Status = TransactionStatus.PartiallyRefunded;
            }

            await _transactionRepository.UpdateAsync(tx, ct);
        }

        await _transactionRepository.SaveChangesAsync(ct);

        await _auditService.LogAsync("transaction.refund", "PaymentTransaction", tx.Id, new { refundAmount, reason, refund.Status }, ct);
        await _webhookDispatcher.DispatchEventAsync(tx.TenantId, "refund.created", "Refund", refund.Id, new
        {
            refundId = refund.Id,
            transactionId = tx.Id,
            amount = refund.Amount,
            status = refund.Status.ToString().ToLowerInvariant(),
            reason = refund.Reason
        }, ct);

        return new RefundDto(
            refund.Id,
            refund.PaymentTransactionId,
            refund.Amount,
            refund.Status.ToString().ToLowerInvariant(),
            refund.Reason,
            refund.ProcessedAt,
            refund.CreatedAt
        );
    }

    private static TransactionDto MapToDto(PaymentTransaction tx)
    {
        TransactionMetadataDto? metaDto = null;
        if (tx.Metadata != null)
        {
            metaDto = new TransactionMetadataDto(
                tx.Metadata.Brand,
                tx.Metadata.Last4,
                tx.Metadata.Installments,
                tx.Metadata.PixExpiration,
                tx.Metadata.PixQrCode,
                tx.Metadata.PixQrCodeUrl,
                tx.Metadata.BoletoDueDate,
                tx.Metadata.BoletoBarcode,
                tx.Metadata.BoletoUrl
            );
        }

        var refunds = tx.Refunds.Select(r => new RefundDto(
            r.Id,
            r.PaymentTransactionId,
            r.Amount,
            r.Status.ToString().ToLowerInvariant(),
            r.Reason,
            r.ProcessedAt,
            r.CreatedAt
        )).ToList();

        return new TransactionDto(
            tx.Id,
            tx.OrderId,
            tx.Order?.PublicCode,
            tx.Order?.Customer?.Name,
            tx.Provider,
            tx.ProviderReference,
            tx.Method.ToString().ToLowerInvariant(),
            tx.Status.ToString().ToLowerInvariant(),
            tx.Amount,
            tx.FeeAmount,
            tx.NetAmount,
            tx.Currency,
            tx.FailureCode,
            tx.PaidAt,
            tx.CreatedAt,
            metaDto,
            refunds
        );
    }
}
