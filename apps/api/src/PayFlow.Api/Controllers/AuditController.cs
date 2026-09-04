using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PayFlow.Application.Features.Audit;
using PayFlow.Contracts.Audit;
using PayFlow.Contracts.Common;

namespace PayFlow.Api.Controllers;

[Authorize]
[Route("api/v1/audit")]
public class AuditController : ApiControllerBase
{
    private readonly IAuditLogService _auditLogService;

    public AuditController(IAuditLogService auditLogService)
    {
        _auditLogService = auditLogService;
    }

    [HttpGet]
    [ProducesResponseType(typeof(PagedApiResponse<AuditEntryDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<PagedApiResponse<AuditEntryDto>>> GetAuditLogs([FromQuery] PagedFilterParams filter, CancellationToken ct)
    {
        var response = await _auditLogService.GetAuditLogsPagedAsync(filter, ct);
        return Ok(response);
    }
}
