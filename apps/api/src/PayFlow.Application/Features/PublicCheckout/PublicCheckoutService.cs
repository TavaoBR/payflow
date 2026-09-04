using System.Text.Json;
using PayFlow.Application.Abstractions;
using PayFlow.Application.Exceptions;
using PayFlow.Contracts.CheckoutSettings;
using PayFlow.Contracts.PublicCheckout;
using PayFlow.Domain.Entities;
using PayFlow.Domain.Enums;
using PayFlow.Domain.ValueObjects;

namespace PayFlow.Application.Features.PublicCheckout;

public interface IPublicCheckoutService
{
    Task<PublicCheckoutDetailsResponse> GetPublicCheckoutAsync(string token, CancellationToken ct = default);
    Task<CheckoutSessionResponse> CreateCheckoutSessionAsync(string token, CreateCheckoutSessionRequest request, CancellationToken ct = default);
    Task<PixPaymentResponse> PayPixAsync(Guid sessionId, CancellationToken ct = default);
    Task<CardPaymentResponse> PayCardAsync(Guid sessionId, CardPaymentRequest request, CancellationToken ct = default);
    Task<BoletoPaymentResponse> PayBoletoAsync(Guid sessionId, CancellationToken ct = default);
    Task<PublicTransactionStatusResponse> GetPublicTransactionStatusAsync(Guid transactionId, CancellationToken ct = default);
}

public class PublicCheckoutService : IPublicCheckoutService
{
    private readonly IPaymentLinkRepository _linkRepository;
    private readonly ICheckoutBrandingRepository _brandingRepository;
    private readonly ICheckoutSessionRepository _sessionRepository;
    private readonly ICustomerRepository _customerRepository;
    private readonly IOrderRepository _orderRepository;
    private readonly ITransactionRepository _transactionRepository;
    private readonly IPaymentGateway _paymentGateway;
    private readonly IWebhookDispatcher _webhookDispatcher;

    public PublicCheckoutService(
        IPaymentLinkRepository linkRepository,
        ICheckoutBrandingRepository brandingRepository,
        ICheckoutSessionRepository sessionRepository,
        ICustomerRepository customerRepository,
        IOrderRepository orderRepository,
        ITransactionRepository transactionRepository,
        IPaymentGateway paymentGateway,
        IWebhookDispatcher webhookDispatcher)
    {
        _linkRepository = linkRepository;
        _brandingRepository = brandingRepository;
        _sessionRepository = sessionRepository;
        _customerRepository = customerRepository;
        _orderRepository = orderRepository;
        _transactionRepository = transactionRepository;
        _paymentGateway = paymentGateway;
        _webhookDispatcher = webhookDispatcher;
    }

    public async Task<PublicCheckoutDetailsResponse> GetPublicCheckoutAsync(string token, CancellationToken ct = default)
    {
        var link = await _linkRepository.GetByPublicTokenAsync(token, ct);
        if (link == null)
            throw new NotFoundException("Link de pagamento não encontrado ou inválido.");

        if (link.Status != PaymentLinkStatus.Active)
            throw new BusinessRuleException("payment_link.inactive", "Este link de pagamento está inativo ou pausado.");

        if (link.ExpiresAt.HasValue && link.ExpiresAt.Value < DateTime.UtcNow)
            throw new BusinessRuleException("payment_link.expired", "Este link de pagamento expirou.");

        var branding = await _brandingRepository.GetByTenantIdAsync(link.TenantId, ct) ?? new CheckoutBranding
        {
            TenantId = link.TenantId,
            PrimaryColor = "#2563eb",
            SecondaryColor = "#0f172a",
            FontFamily = "Geist",
            RadiusPreset = "rounded-lg",
            CtaText = "Pagar Agora",
            SuccessTitle = "Pagamento Concluído!",
            SuccessMessage = "Seu pagamento foi confirmado com sucesso."
        };

        var brandingDto = new CheckoutSettingsDto(
            branding.TenantId,
            branding.LogoUrl,
            branding.PrimaryColor,
            branding.SecondaryColor,
            branding.FontFamily,
            branding.RadiusPreset,
            branding.CtaText,
            branding.SuccessTitle,
            branding.SuccessMessage,
            branding.RedirectUrl,
            branding.RedirectDelaySeconds
        );

        PublicProductDto? prodDto = null;
        if (link.Product != null)
        {
            prodDto = new PublicProductDto(
                link.Product.Id,
                link.Product.Name,
                link.Product.Description,
                link.Product.ImageUrl,
                link.Product.PriceAmount,
                link.Product.Currency
            );
        }

        var allowedMethods = link.AllowedMethods.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
        var finalAmount = link.FixedAmount ?? link.Product?.PriceAmount ?? 0m;

        return new PublicCheckoutDetailsResponse(
            link.Id,
            link.PublicToken,
            link.Title,
            link.Description,
            finalAmount,
            link.Currency,
            allowedMethods,
            link.PixDiscountPct,
            link.MaxInstallments,
            link.ExpiresAt,
            link.Status.ToString().ToLowerInvariant(),
            brandingDto,
            prodDto
        );
    }

    public async Task<CheckoutSessionResponse> CreateCheckoutSessionAsync(string token, CreateCheckoutSessionRequest request, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(request.CustomerName))
            throw new ValidationException("customerName", "customer.name_required", "Nome do comprador é obrigatório.");
        if (string.IsNullOrWhiteSpace(request.CustomerEmail))
            throw new ValidationException("customerEmail", "customer.email_required", "E-mail do comprador é obrigatório.");

        var link = await _linkRepository.GetByPublicTokenAsync(token, ct);
        if (link == null || link.Status != PaymentLinkStatus.Active)
            throw new NotFoundException("Link de pagamento inválido ou expirado.");

        var tenantId = link.TenantId;
        var customer = await _customerRepository.GetByEmailAsync(request.CustomerEmail.Trim(), ct);
        if (customer == null)
        {
            customer = new Customer
            {
                TenantId = tenantId,
                Name = request.CustomerName.Trim(),
                Email = request.CustomerEmail.Trim().ToLowerInvariant(),
                Phone = request.CustomerPhone?.Trim(),
                Status = CustomerStatus.Active
            };
            await _customerRepository.AddAsync(customer, ct);
            await _customerRepository.SaveChangesAsync(ct);
        }

        var amount = link.FixedAmount ?? link.Product?.PriceAmount ?? 0m;
        var publicCode = $"ORD-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString("N")[..6].ToUpperInvariant()}";

        var order = new Order
        {
            TenantId = tenantId,
            CustomerId = customer.Id,
            Customer = customer,
            PublicCode = publicCode,
            Status = OrderStatus.PendingPayment,
            Currency = link.Currency
        };

        order.AddItem(link.ProductId, link.Title, 1, amount);

        await _orderRepository.AddAsync(order, ct);
        await _orderRepository.SaveChangesAsync(ct);

        var sessionToken = $"cs_{Guid.NewGuid():N}";
        var session = new CheckoutSession
        {
            TenantId = tenantId,
            PaymentLinkId = link.Id,
            OrderId = order.Id,
            PublicToken = sessionToken,
            Status = CheckoutSessionStatus.Active,
            ExpiresAt = DateTime.UtcNow.AddMinutes(30),
            CustomerSnapshotJson = JsonSerializer.Serialize(new
            {
                Name = customer.Name,
                Email = customer.Email,
                Phone = customer.Phone
            })
        };

        await _sessionRepository.AddAsync(session, ct);
        await _sessionRepository.SaveChangesAsync(ct);

        return new CheckoutSessionResponse(
            session.Id,
            session.PublicToken,
            order.Id,
            order.PublicCode,
            order.TotalAmount,
            order.Currency,
            session.ExpiresAt
        );
    }

    public async Task<PixPaymentResponse> PayPixAsync(Guid sessionId, CancellationToken ct = default)
    {
        var session = await _sessionRepository.GetByIdWithDetailsAsync(sessionId, ct);
        if (session == null || session.Status != CheckoutSessionStatus.Active)
            throw new NotFoundException("Sessão de checkout inválida ou expirada.");

        if (session.Order == null)
            throw new BusinessRuleException("checkout.no_order", "Nenhum pedido associado a esta sessão de checkout.");

        var amount = session.Order.TotalAmount;
        if (session.PaymentLink != null && session.PaymentLink.PixDiscountPct > 0)
        {
            var discount = amount * (session.PaymentLink.PixDiscountPct / 100m);
            amount = Math.Max(0.01m, amount - discount);
        }

        var tx = new PaymentTransaction
        {
            TenantId = session.TenantId,
            OrderId = session.Order.Id,
            CheckoutSessionId = session.Id,
            Provider = "MockGateway",
            ProviderReference = $"PIX-{Guid.NewGuid():N}",
            Method = PaymentMethod.Pix,
            Status = TransactionStatus.Pending,
            Amount = amount,
            FeeAmount = Math.Round(amount * 0.0099m, 2),
            NetAmount = amount - Math.Round(amount * 0.0099m, 2),
            Currency = session.Order.Currency,
            IdempotencyKey = Guid.NewGuid().ToString()
        };

        var gatewayResult = await _paymentGateway.ProcessPixAsync(tx, ct);

        tx.Metadata = new PaymentMethodMetadata
        {
            PaymentTransactionId = tx.Id,
            PixQrCode = gatewayResult.PixQrCode,
            PixQrCodeUrl = gatewayResult.PixQrCodeUrl,
            PixExpiration = gatewayResult.PixExpiration
        };

        await _transactionRepository.AddAsync(tx, ct);
        await _transactionRepository.SaveChangesAsync(ct);

        return new PixPaymentResponse(
            tx.Id,
            tx.Status.ToString().ToLowerInvariant(),
            tx.Amount,
            tx.Currency,
            gatewayResult.PixQrCode ?? string.Empty,
            gatewayResult.PixQrCodeUrl ?? string.Empty,
            gatewayResult.PixExpiration ?? DateTime.UtcNow.AddMinutes(15)
        );
    }

    public async Task<CardPaymentResponse> PayCardAsync(Guid sessionId, CardPaymentRequest request, CancellationToken ct = default)
    {
        var session = await _sessionRepository.GetByIdWithDetailsAsync(sessionId, ct);
        if (session == null || session.Status != CheckoutSessionStatus.Active)
            throw new NotFoundException("Sessão de checkout inválida ou expirada.");

        if (session.Order == null)
            throw new BusinessRuleException("checkout.no_order", "Nenhum pedido associado a esta sessão.");

        var tx = new PaymentTransaction
        {
            TenantId = session.TenantId,
            OrderId = session.Order.Id,
            CheckoutSessionId = session.Id,
            Provider = "MockGateway",
            ProviderReference = $"CARD-{Guid.NewGuid():N}",
            Method = PaymentMethod.CreditCard,
            Status = TransactionStatus.Processing,
            Amount = session.Order.TotalAmount,
            FeeAmount = Math.Round(session.Order.TotalAmount * 0.0299m, 2),
            NetAmount = session.Order.TotalAmount - Math.Round(session.Order.TotalAmount * 0.0299m, 2),
            Currency = session.Order.Currency,
            IdempotencyKey = Guid.NewGuid().ToString()
        };

        var gatewayResult = await _paymentGateway.ProcessCardAsync(tx, request, ct);

        tx.Status = gatewayResult.Status;
        tx.FailureCode = gatewayResult.FailureReason;
        tx.PaidAt = gatewayResult.Success ? DateTime.UtcNow : null;

        tx.Metadata = new PaymentMethodMetadata
        {
            PaymentTransactionId = tx.Id,
            Brand = gatewayResult.CardBrand,
            Last4 = gatewayResult.CardLast4,
            Installments = Math.Max(1, request.Installments)
        };

        if (gatewayResult.Success)
        {
            session.Order.Status = OrderStatus.Paid;
            session.Status = CheckoutSessionStatus.Completed;
        }

        await _transactionRepository.AddAsync(tx, ct);
        await _transactionRepository.SaveChangesAsync(ct);

        if (gatewayResult.Success)
        {
            await _webhookDispatcher.DispatchEventAsync(tx.TenantId, "payment.succeeded", "PaymentTransaction", tx.Id, new
            {
                transactionId = tx.Id,
                orderId = session.Order.Id,
                amount = tx.Amount,
                status = "paid"
            }, ct);
        }
        else
        {
            await _webhookDispatcher.DispatchEventAsync(tx.TenantId, "payment.failed", "PaymentTransaction", tx.Id, new
            {
                transactionId = tx.Id,
                orderId = session.Order.Id,
                amount = tx.Amount,
                status = "failed",
                reason = gatewayResult.FailureReason
            }, ct);
        }

        return new CardPaymentResponse(
            tx.Id,
            tx.Status.ToString().ToLowerInvariant(),
            tx.Amount,
            tx.Currency,
            tx.FailureCode,
            tx.PaidAt
        );
    }

    public async Task<BoletoPaymentResponse> PayBoletoAsync(Guid sessionId, CancellationToken ct = default)
    {
        var session = await _sessionRepository.GetByIdWithDetailsAsync(sessionId, ct);
        if (session == null || session.Status != CheckoutSessionStatus.Active)
            throw new NotFoundException("Sessão de checkout inválida ou expirada.");

        if (session.Order == null)
            throw new BusinessRuleException("checkout.no_order", "Nenhum pedido associado a esta sessão.");

        var tx = new PaymentTransaction
        {
            TenantId = session.TenantId,
            OrderId = session.Order.Id,
            CheckoutSessionId = session.Id,
            Provider = "MockGateway",
            ProviderReference = $"BOL-{Guid.NewGuid():N}",
            Method = PaymentMethod.Boleto,
            Status = TransactionStatus.Pending,
            Amount = session.Order.TotalAmount,
            FeeAmount = 2.50m,
            NetAmount = Math.Max(0m, session.Order.TotalAmount - 2.50m),
            Currency = session.Order.Currency,
            IdempotencyKey = Guid.NewGuid().ToString()
        };

        var gatewayResult = await _paymentGateway.ProcessBoletoAsync(tx, ct);

        tx.Metadata = new PaymentMethodMetadata
        {
            PaymentTransactionId = tx.Id,
            BoletoBarcode = gatewayResult.BoletoBarcode,
            BoletoUrl = gatewayResult.BoletoUrl,
            BoletoDueDate = gatewayResult.BoletoDueDate
        };

        await _transactionRepository.AddAsync(tx, ct);
        await _transactionRepository.SaveChangesAsync(ct);

        return new BoletoPaymentResponse(
            tx.Id,
            tx.Status.ToString().ToLowerInvariant(),
            tx.Amount,
            tx.Currency,
            gatewayResult.BoletoBarcode ?? string.Empty,
            gatewayResult.BoletoUrl ?? string.Empty,
            gatewayResult.BoletoDueDate ?? DateTime.UtcNow.AddDays(3)
        );
    }

    public async Task<PublicTransactionStatusResponse> GetPublicTransactionStatusAsync(Guid transactionId, CancellationToken ct = default)
    {
        var tx = await _transactionRepository.GetByIdWithDetailsAsync(transactionId, ct);
        if (tx == null)
            throw new NotFoundException("Transação não encontrada.");

        return new PublicTransactionStatusResponse(
            tx.Id,
            tx.Status.ToString().ToLowerInvariant(),
            tx.Method.ToString().ToLowerInvariant(),
            tx.Amount,
            tx.Currency,
            tx.PaidAt,
            tx.FailureCode
        );
    }
}
