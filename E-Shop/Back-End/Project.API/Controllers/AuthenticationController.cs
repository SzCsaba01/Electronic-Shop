using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Project.Data.Dto.Authentiaction;
using Project.Services.Contracts;

namespace Project.API.Controllers;
[Route("api/[controller]")]
[ApiController]
public class AuthenticationController : ControllerBase {
    private readonly IAuthenticationService _authenticationService;
    public AuthenticationController(IAuthenticationService authenticationService) {
        _authenticationService = authenticationService;
    }

    [HttpPost("Login")]
    [AllowAnonymous]
    public async Task<IActionResult> LoginAsync(AuthenticationRequestDto authenticationRequestDto) {
        return Ok(await _authenticationService.LoginAsync(authenticationRequestDto));
    }
}
