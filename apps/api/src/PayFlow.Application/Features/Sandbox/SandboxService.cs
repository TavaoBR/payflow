using PayFlow.Application.Abstractions;
using PayFlow.Application.Exceptions;
using PayFlow.Contracts.Sandbox;
using PayFlow.Domain.Enums;

namespace PayFlow.Application.Features.Sandbox;

public interface ISandboxService
{
    Task<SimulateTransactionResponse> SimulateTransactionAsync(Guid transactionId, SimulateTransactionRequest request, CancellationToken ct = default);
}

public class SandboxService : ISandboxService
{
    private readonly ITransactionRepository _transactionRepository;
    private readonly IWebhookDispatcher _webhookDispatcher;
    private readonly IAuditService _auditService;

    public SandboxService(
        ITransactionRepository transactionRepository,
        IWebhookDispatcher webhookDispatcher,
        IAuditService auditService)
    {
        _transactionRepository = transactionRepository;
        _webhookDispatcher = webhookDispatcher;
        _auditService = auditService;
    }

    public async Task<SimulateTransactionResponse> SimulateTransactionAsync(Guid transactionId, SimulateTransactionRequest request, CancellationToken ct = default)
    {
        var tx = await _transactionRepository.GetByIdWithDetailsAsync(transactionId, ct);
        if (tx == null)
            throw new NotFoundException("PaymentTransaction", transactionId);

        var prevStatus = tx.Status.ToString().ToLowerInvariant();
        var action = request.Action.ToLowerInvariant().Trim();

        if (action == "approve" || action == "pay")
        {
            tx.Status = TransactionStatus.Paid;
            tx.PaidAt = DateTime.UtcNow;
            if (tx.Order != null) tx.Order.Status = OrderStatus.Paid;
            if (tx.CheckoutSession != null) tx.CheckoutSession.Status = CheckoutSessionStatus.Completed;

            await _transactionRepository.UpdateAsync(tx, ct);
            await _transactionRepository.SaveChangesAsync(ct);

            await _auditService.LogAsync("sandbox.simulate_payment_approved", "PaymentTransaction", tx.Id, new { previousStatus = prevStatus }, ct);
            await _webhookDispatcher.DispatchEventAsync(tx.TenantId, "payment.succeeded", "PaymentTransaction", tx.Id, new
            {
                transactionId = tx.Id,
                orderId = tx.OrderId,
                amount = tx.Amount,
                status = "paid",
                simulated = true
            }, ct);

            return new SimulateTransactionResponse(
                tx.Id,
                prevStatus,
                "paid",
                "Pagamento simulado com sucesso (aprovado)."
            );
        }
        else if (action == "fail" || action == "decline")
        {
            tx.Status = TransactionStatus.Failed;
            tx.FailureCode = request.FailureCode ?? "SIMULATED_FAILURE";
            if (tx.Order != null && tx.Order.Status == OrderStatus.PendingPayment)
                tx.Order.Status = OrderStatus.Draft;

            await _transactionRepository.UpdateAsync(tx, ct);
            await _transactionRepository.SaveChangesAsync(ct);

            await _auditService.LogAsync("sandbox.simulate_payment_failed", "PaymentTransaction", tx.Id, new { failureCode = tx.FailureCode }, ct);
            await _webhookDispatcher.DispatchEventAsync(tx.TenantId, "payment.failed", "PaymentTransaction", tx.Id, new
            {
                transactionId = tx.Id,
                orderId = tx.OrderId,
                amount = tx.Amount,
                status = "failed",
                failureCode = tx.FailureCode,
                simulated = true
            }, ct);

            return new SimulateTransactionResponse(
                tx.Id,
                prevStatus,
                "failed",
                "Falha de pagamento simulada com sucesso."
            );
        }

        throw new ValidationException("action", "sandbox.invalid_action", "Ação de simulação inválida. Use 'approve' ou 'fail'.");
    }
}
