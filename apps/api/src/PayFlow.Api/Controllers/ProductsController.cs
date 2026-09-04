using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PayFlow.Application.Features.Products;
using PayFlow.Contracts.Common;
using PayFlow.Contracts.Products;

namespace PayFlow.Api.Controllers;

[Authorize]
[Route("api/v1/products")]
public class ProductsController : ApiControllerBase
{
    private readonly IProductService _productService;

    public ProductsController(IProductService productService)
    {
        _productService = productService;
    }

    [HttpGet]
    [ProducesResponseType(typeof(PagedApiResponse<ProductDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<PagedApiResponse<ProductDto>>> GetProducts(
        [FromQuery] PagedFilterParams filter,
        [FromQuery] string? type,
        CancellationToken ct)
    {
        var response = await _productService.GetProductsPagedAsync(filter, type, ct);
        return Ok(response);
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(ApiResponse<ProductDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<ProductDto>>> GetById(Guid id, CancellationToken ct)
    {
        var product = await _productService.GetProductByIdAsync(id, ct);
        return OkResponse(product);
    }

    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<ProductDto>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ApiResponse<ProductDto>>> CreateProduct([FromBody] CreateProductRequest request, CancellationToken ct)
    {
        var product = await _productService.CreateProductAsync(request, ct);
        return StatusCode(StatusCodes.Status201Created, ApiResponse<ProductDto>.Ok(product, "Produto cadastrado com sucesso."));
    }

    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(ApiResponse<ProductDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<ProductDto>>> UpdateProduct(Guid id, [FromBody] UpdateProductRequest request, CancellationToken ct)
    {
        var product = await _productService.UpdateProductAsync(id, request, ct);
        return OkResponse(product, "Produto atualizado com sucesso.");
    }

    [HttpPatch("{id:guid}/status")]
    [ProducesResponseType(typeof(ApiResponse<ProductDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<ProductDto>>> UpdateStatus(Guid id, [FromBody] UpdateProductStatusRequest request, CancellationToken ct)
    {
        var product = await _productService.UpdateProductStatusAsync(id, request, ct);
        return OkResponse(product, "Status do produto atualizado com sucesso.");
    }

    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteProduct(Guid id, CancellationToken ct)
    {
        await _productService.DeleteProductAsync(id, ct);
        return NoContent();
    }
}
