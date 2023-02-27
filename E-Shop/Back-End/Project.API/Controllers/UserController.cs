using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Project.Data.Dto.User;
using Project.Services.Business;
using Project.Services.Contracts;
using ToDoList.Data.Dto.Email;

namespace Project.API.Controllers;
[Route("api/[controller]")]
[ApiController]
public class UserController : ControllerBase {
    private readonly IUserService _userService;
    public UserController(IUserService userService) {
        _userService = userService;
    }

    [HttpPost("Registration")]
    public async Task<IActionResult> RegistrationAsync(UserRegisterDto userDto) {
        await _userService.RegistrationAsync(userDto);
        return Ok("You have successfully registered, verify your email to be able to log in");
    }

    [HttpPost("ConfirmRegistration")]
    public async Task<IActionResult> ConfirmRegistrationAsync(string resetPasswordToken) {
        await _userService.ConfirmRegistrationAsync(resetPasswordToken);
        return Ok("Successfully verified your email");
    }

    [HttpPost("ForgotPassword")]
    public async Task<IActionResult> ForgotPasswordAsync(SendForgotPasswordEmailDto sendForgotPasswordEmailDto) {
        await _userService.ForgotPasswordAsync(sendForgotPasswordEmailDto);
        return Ok("We have sent you an email to change your password");
    }

    [HttpPost("ChangePassword")]
    public async Task<IActionResult> ChangePasswordAsync(ChangePasswordDto changePasswordDto) {
        await _userService.ChangePasswordAsync(changePasswordDto);
        return Ok("You have successfully changed your password");
    }

    [HttpGet("GetUserIdByResetPasswordToken")]
    public async Task<IActionResult> GetUserIdByResetPasswordTokenAsync(string token) {
        return Ok(await _userService.GetUserIdByResetPasswordTokenAsync(token));
    }

    [HttpPut("ChangeProfilePicture")]
    [Authorize(Roles = "User,Admin")]
    public async Task<IActionResult> ChangeProfilePictureAsync([FromForm]ChangeProfilePictureDto changeProfilePictureDto) {
        await _userService.ChangeProfilePictureAsync(changeProfilePictureDto);
        return Ok();
    }

    [HttpGet("GetProfilePictureUrl")]
    [Authorize(Roles = "Admin,User")]
    public async Task<IActionResult> GetProfilePictureByIdAsync(Guid Id) {
        return Ok(await _userService.GetProfilePictureByIdAsync(Id));
    }

    [HttpGet("GetProfileDetails")]
    [Authorize(Roles = "User,Admin")]
    public async Task<IActionResult> GetUserProfileDetailsByIdAsync(Guid Id) {
        return Ok(await _userService.GetUserProfileDetailsByIdAsync(Id));
    }

    [HttpPut("EditProfile")]
    [Authorize(Roles = "User,Admin")]
    public async Task<IActionResult> EditUserProfileDetailsAsync(EditUserDto editUserDto) {
        await _userService.EditUserProfileDetailsAsync(editUserDto);
        return Ok();
    }

    [HttpPost("SearchUsersByUsername")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetSearchedUsersByUserNameAsync(UserSearchDto userSearchDto) {
        return Ok(await _userService.GetSearchedUsersByUserNameAsync(userSearchDto));
    }

    [HttpPost("SearchUsersByEmail")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetSearchByEmailAsync(UserSearchDto userSearchDto) {
        return Ok(await _userService.GetSearchedUsersByEmailAsync(userSearchDto));
    }

    [HttpGet("PaginatedUsers")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetUsersPaginatedAsync(int page) {
        return Ok(await _userService.GetUsersPaginatedAsync(page));
    }

    [HttpDelete("DeleteUser")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteUserAsync(string username) {
        await _userService.DeleteUserProfileDetailsAsync(username);
        return Ok();
    }

}
