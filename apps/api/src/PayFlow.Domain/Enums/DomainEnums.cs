namespace PayFlow.Domain.Enums;

public enum TenantStatus
{
    Active = 1,
    Suspended = 2,
    Cancelled = 3
}

public enum UserStatus
{
    Active = 1,
    Inactive = 2,
    Blocked = 3
}

public enum ProductStatus
{
    Draft = 1,
    Active = 2,
    Archived = 3
}

public enum ProductType
{
    Physical = 1,
    Digital = 2,
    Service = 3
}

public enum CustomerStatus
{
    Active = 1,
    Blocked = 2
}

public enum OrderStatus
{
    Draft = 1,
    PendingPayment = 2,
    Paid = 3,
    Cancelled = 4,
    Expired = 5
}

public enum PaymentMethod
{
    Pix = 1,
    CreditCard = 2,
    Boleto = 3
}

public enum TransactionStatus
{
    Pending = 1,
    Processing = 2,
    Paid = 3,
    Failed = 4,
    Cancelled = 5,
    Expired = 6,
    PartiallyRefunded = 7,
    Refunded = 8
}

public enum RefundStatus
{
    Pending = 1,
    Approved = 2,
    Failed = 3
}

public enum PaymentLinkStatus
{
    Active = 1,
    Archived = 2,
    Expired = 3
}

public enum CheckoutSessionStatus
{
    Active = 1,
    Completed = 2,
    Expired = 3
}

public enum WebhookEndpointStatus
{
    Active = 1,
    Disabled = 2
}

public enum WebhookDeliveryStatus
{
    Pending = 1,
    Delivered = 2,
    Failed = 3
}
