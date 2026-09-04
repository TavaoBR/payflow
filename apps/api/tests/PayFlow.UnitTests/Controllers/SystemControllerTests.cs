using Microsoft.AspNetCore.Mvc;
using PayFlow.Api.Controllers;
using PayFlow.Contracts.Common;
using Xunit;

namespace PayFlow.UnitTests.Controllers;

public class SystemControllerTests
{
    [Fact]
    public void GetStatus_ShouldReturnOkWithV1Status()
    {
        // Arrange
        var controller = new SystemController();

        // Act
        var result = controller.GetStatus();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var envelope = Assert.IsType<ApiResponse<SystemStatusResponse>>(okResult.Value);

        Assert.True(envelope.Success);
        Assert.NotNull(envelope.Data);
        Assert.Equal("v1", envelope.Data.ApiVersion);
        Assert.Equal("operational", envelope.Data.Status);
    }
}
