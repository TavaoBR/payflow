using Microsoft.AspNetCore.Mvc;
using PayFlow.Api.Controllers;
using PayFlow.Contracts.Common;
using Xunit;

namespace PayFlow.UnitTests.Controllers;

public class HealthControllerTests
{
    [Fact]
    public void Live_ShouldReturnOkWithHealthyStatus()
    {
        // Arrange
        var controller = new HealthController();

        // Act
        var result = controller.Live();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var envelope = Assert.IsType<ApiResponse<object>>(okResult.Value);
        Assert.True(envelope.Success);
        Assert.Empty(envelope.Errors);
    }

    [Fact]
    public void Ready_ShouldReturnOkWithReadyStatus()
    {
        // Arrange
        var controller = new HealthController();

        // Act
        var result = controller.Ready();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var envelope = Assert.IsType<ApiResponse<object>>(okResult.Value);
        Assert.True(envelope.Success);
        Assert.Empty(envelope.Errors);
    }
}
