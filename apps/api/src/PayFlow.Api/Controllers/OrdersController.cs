using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PayFlow.Application.Features.Orders;
using PayFlow.Contracts.Common;
using PayFlow.Contracts.Orders;

namespace PayFlow.Api.Controllers;

[Authorize]
[Route("api/v1/orders")]
public class OrdersController : ApiControllerBase
{
    private readonly IOrderService _orderService;

    public OrdersController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    [HttpGet]
    [ProducesResponseType(typeof(PagedApiResponse<OrderDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<PagedApiResponse<OrderDto>>> GetOrders(
        [FromQuery] PagedFilterParams filter,
        [FromQuery] Guid? customerId,
        CancellationToken ct)
    {
        var response = await _orderService.GetOrdersPagedAsync(filter, customerId, ct);
        return Ok(response);
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(ApiResponse<OrderDetailDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<OrderDetailDto>>> GetById(Guid id, CancellationToken ct)
    {
        var order = await _orderService.GetOrderByIdAsync(id, ct);
        return OkResponse(order);
    }

    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<OrderDetailDto>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ApiResponse<OrderDetailDto>>> CreateOrder([FromBody] CreateOrderRequest request, CancellationToken ct)
    {
        var order = await _orderService.CreateOrderAsync(request, ct);
        return StatusCode(StatusCodes.Status201Created, ApiResponse<OrderDetailDto>.Ok(order, "Pedido criado com sucesso."));
    }

    [HttpPost("{id:guid}/cancel")]
    [ProducesResponseType(typeof(ApiResponse<OrderDetailDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status409Conflict)]
    public async Task<ActionResult<ApiResponse<OrderDetailDto>>> CancelOrder(Guid id, CancellationToken ct)
    {
        var order = await _orderService.CancelOrderAsync(id, ct);
        return OkResponse(order, "Pedido cancelado com sucesso.");
    }
}
