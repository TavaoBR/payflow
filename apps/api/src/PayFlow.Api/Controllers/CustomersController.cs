using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PayFlow.Application.Features.Customers;
using PayFlow.Contracts.Common;
using PayFlow.Contracts.Customers;

namespace PayFlow.Api.Controllers;

[Authorize]
[Route("api/v1/customers")]
public class CustomersController : ApiControllerBase
{
    private readonly ICustomerService _customerService;

    public CustomersController(ICustomerService customerService)
    {
        _customerService = customerService;
    }

    [HttpGet]
    [ProducesResponseType(typeof(PagedApiResponse<CustomerDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<PagedApiResponse<CustomerDto>>> GetCustomers([FromQuery] PagedFilterParams filter, CancellationToken ct)
    {
        var response = await _customerService.GetCustomersPagedAsync(filter, ct);
        return Ok(response);
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(ApiResponse<CustomerDetailDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<CustomerDetailDto>>> GetById(Guid id, CancellationToken ct)
    {
        var customer = await _customerService.GetCustomerByIdAsync(id, ct);
        return OkResponse(customer);
    }

    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<CustomerDto>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ApiResponse<CustomerDto>>> CreateCustomer([FromBody] CreateCustomerRequest request, CancellationToken ct)
    {
        var customer = await _customerService.CreateCustomerAsync(request, ct);
        return StatusCode(StatusCodes.Status201Created, ApiResponse<CustomerDto>.Ok(customer, "Cliente cadastrado com sucesso."));
    }

    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(ApiResponse<CustomerDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<CustomerDto>>> UpdateCustomer(Guid id, [FromBody] UpdateCustomerRequest request, CancellationToken ct)
    {
        var customer = await _customerService.UpdateCustomerAsync(id, request, ct);
        return OkResponse(customer, "Cliente atualizado com sucesso.");
    }

    [HttpPatch("{id:guid}/status")]
    [ProducesResponseType(typeof(ApiResponse<CustomerDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<CustomerDto>>> UpdateStatus(Guid id, [FromBody] UpdateCustomerStatusRequest request, CancellationToken ct)
    {
        var customer = await _customerService.UpdateCustomerStatusAsync(id, request, ct);
        return OkResponse(customer, "Status do cliente atualizado com sucesso.");
    }
}
