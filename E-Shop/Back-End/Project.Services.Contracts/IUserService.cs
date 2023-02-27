using Project.Data.Dto.User;
using ToDoList.Data.Dto.Email;

namespace Project.Services.Contracts;
public interface IUserService {
    Task RegistrationAsync(UserRegisterDto userDto);
    Task ForgotPasswordAsync(SendForgotPasswordEmailDto sendForgotPasswordEmailDto);
    Task ConfirmRegistrationAsync(string resetPasswordToken);
    Task ChangePasswordAsync(ChangePasswordDto changePasswordDto);
    Task<Guid> GetUserIdByResetPasswordTokenAsync(string token);
    Task ChangeProfilePictureAsync(ChangeProfilePictureDto changeProfilePictureDto);
    Task<string> GetProfilePictureByIdAsync(Guid Id);
    Task<UserProfileDetailsDto> GetUserProfileDetailsByIdAsync(Guid Id);
    Task EditUserProfileDetailsAsync(EditUserDto editUserDto);
    Task DeleteUserProfileDetailsAsync(string username);
    Task<UserPaginationDto> GetUsersPaginatedAsync(int page);
    Task<UserPaginationDto> GetSearchedUsersByUserNameAsync(UserSearchDto userSearchDto);
    Task<UserPaginationDto> GetSearchedUsersByEmailAsync(UserSearchDto userSearchDto);
}
