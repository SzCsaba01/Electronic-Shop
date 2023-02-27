using Microsoft.EntityFrameworkCore;
using Project.Data;
using Project.Data.Data;
using Project.Data.Dto.Email;
using Project.Data.Dto.User;
using Project.Data.Mappers;
using Project.Services.Business.Exceptions;
using Project.Services.Contracts;
using ToDoList.Data.Dto.Email;

namespace Project.Services.Business;
public class UserService : IUserService {
    private readonly IEncryptionService _encryptionService;
    private readonly DataContext _dataContext;
    private readonly ITokenService _tokenService;
    private readonly IEmailService _emailService;

    public UserService(DataContext dataContext, IEncryptionService encryptionService, ITokenService tokenService, IEmailService emailService) {
        _dataContext = dataContext;
        _encryptionService = encryptionService;
        _tokenService = tokenService;
        _emailService = emailService;
    }

    public async Task<bool> VerifyExistingEmailAsync(string email) {

        var user = await _dataContext.Users.Select(u => u.Email).FirstOrDefaultAsync(u => u.Equals(email));

        if (user is null) {
            return false;
        }

        return true;
    }

    public async Task<bool> VerifyExistingUsernameAsync(string userName) {

        var user = await _dataContext.Users.Select(u => u.Username).FirstOrDefaultAsync(u => u.Equals(userName));

        if (user is null) {
            return false;
        }

        return true;
    }

    public async Task RegistrationAsync(UserRegisterDto userDto) {
        if( await VerifyExistingUsernameAsync(userDto.Username)) {
            throw new AlreadyExistsException("Username already taken");
        }

        if (await VerifyExistingEmailAsync(userDto.Email)) {
            throw new AlreadyExistsException("Email already taken");
        }

        var role = await _dataContext.Roles.FirstOrDefaultAsync(r => r.RoleType == 0);

        if (role is null) {
            throw new ModelNotFoundException("Something wrong happend...");
        }

        if (!userDto.Password.Equals(userDto.RepeatPassword)) {
            throw new PasswordException("Passwords doesn't match");
        }

        userDto.Password = _encryptionService.GeneratedHashedPassword(userDto.Password);
        userDto.RepeatPassword = userDto.Password;

        var user = UserMapper.ToUser(userDto);
        user.Role = role;

        user.RegistrationToken = await _tokenService.GenerateRandomTokenAsync() + user.Username;

        await _dataContext.Users.AddAsync(user);
        await _dataContext.SaveChangesAsync();

        var sendVerificationEmail = new SendVerificationEmailDto {
            Email = user.Email,
            Token = user.RegistrationToken
        };

        await _emailService.SendVerificationEmail(sendVerificationEmail);
    }

    public async Task ForgotPasswordAsync(SendForgotPasswordEmailDto sendForgotPasswordEmailDto) {
        var user = await _dataContext.Users.FirstOrDefaultAsync(u => u.Email.Equals(sendForgotPasswordEmailDto.Email));

        if (user is null) {
            throw new ModelNotFoundException("Email not found");
        }

        sendForgotPasswordEmailDto.Token = await _tokenService.GenerateRandomTokenAsync() + sendForgotPasswordEmailDto.Email;

        user.ResetPasswordTokenGenerationTime = DateTime.UtcNow;
        user.ResetPasswordToken = sendForgotPasswordEmailDto.Token;

        await _emailService.SendForgotPasswordEmailAsync(sendForgotPasswordEmailDto);

        await _dataContext.SaveChangesAsync();
    }

    public async Task ConfirmRegistrationAsync(string resetPasswordToken) {
        var user = await _dataContext.Users.FirstOrDefaultAsync(u => u.RegistrationToken.Equals(resetPasswordToken));

        if(user is null) {
            throw new ModelNotFoundException("User not found");
        }

        user.isConfirmedRegistrationToken = true;

        await _dataContext.SaveChangesAsync();
    }

    public async Task ChangePasswordAsync(ChangePasswordDto changePasswordDto) {
        if (!changePasswordDto.newPassword.Equals(changePasswordDto.repeatNewPassword)) {
            throw new PasswordException("Passwords doesn't match");
        }

        var user = await _dataContext.Users.FindAsync(changePasswordDto.Id);

        if(user is null) {
            throw new PasswordException("User not found");
        }

        user.Password = _encryptionService.GeneratedHashedPassword(changePasswordDto.newPassword);

        await _dataContext.SaveChangesAsync();
    }

    public async Task<Guid> GetUserIdByResetPasswordTokenAsync(string token) {
        var user = await _dataContext.Users.FirstOrDefaultAsync(u => u.ResetPasswordToken.Equals(token));

        if(user is null) {
            throw new ModelNotFoundException("User not found");
        }

        return user.Id;
    }

    public async Task ChangeProfilePictureAsync(ChangeProfilePictureDto changeProfilePictureDto) {
        var file = changeProfilePictureDto.File;
        var folderName = Path.Combine(AppConstants.RESOURCES, AppConstants.USER_PROFILE_IMAGES);
        var pathToSave = Path.Combine(Directory.GetParent(Directory.GetCurrentDirectory()).FullName, AppConstants.RESOURCE_FOLDER, folderName);

        if (file.Length <= 0) {
            throw new ModelNotFoundException("File not found");
        }

        var fileName = file.FileName;
        var fullPath = Path.Combine(pathToSave, fileName);
        var dbPath = Path.Combine(folderName, fileName);

        var oldFile = await _dataContext.Users
            .Where(u => u.Id == changeProfilePictureDto.UserId)
            .Select(u => u.ProfilePicture)
            .FirstOrDefaultAsync();

        if (oldFile is not null) {

            oldFile = Path.Combine(Directory.GetParent(Directory.GetCurrentDirectory()).FullName, AppConstants.RESOURCE_FOLDER, oldFile);

            if (File.Exists(oldFile)) {
                File.Delete(oldFile);
            }
        }

        using (var stream = new FileStream(fullPath, FileMode.Create)) {
            file.CopyTo(stream);
        }

        var user = await _dataContext.Users.FindAsync(changeProfilePictureDto.UserId);

        if (user is null) {
            throw new ModelNotFoundException("User not found");
        }

        user.ProfilePicture = dbPath;
        await _dataContext.SaveChangesAsync();
    }

    public async Task<string> GetProfilePictureByIdAsync(Guid Id) {
        var profilePictureUrl = await _dataContext.Users
            .Where(u => u.Id == Id)
            .Select(u => u.ProfilePicture)
            .FirstOrDefaultAsync();

        //if (profilePictureUrl is null) {
        //    throw new ModelNotFoundException("Profile Picture not found");
        //}

        var fullPath = Path.Combine(AppConstants.APP_URL, profilePictureUrl);

        return fullPath;
    }

    public async Task<UserProfileDetailsDto> GetUserProfileDetailsByIdAsync(Guid Id) {
        var user = await _dataContext.Users
            .Where(u => u.Id == Id)
            .Select(u => new UserProfileDetailsDto {
                Username = u.Username,
                FirstName = u.FirstName,
                LastName = u.LastName,
                Email = u.Email,
                City = u.City,
                Country = u.Country,
                State = u.State,
                Address = u.Address,
                PhoneNumber = u.PhoneNumber,
                ProfilePicture = u.ProfilePicture
            })
            .FirstOrDefaultAsync();

        if (user is null) {
            throw new ModelNotFoundException("User not found");
        }

        if (user.ProfilePicture is null) {
            return user;
        }

        var fullPath = Path.Combine(AppConstants.APP_URL, user.ProfilePicture);
        user.ProfilePicture = fullPath;

        return user;
    }

    public async Task EditUserProfileDetailsAsync(EditUserDto editUserDto) {
        var user = await _dataContext.Users.FindAsync(editUserDto.UserId);

        if (user is null) {
            throw new ModelNotFoundException("User not found");
        }

        if(!user.Username.Equals(editUserDto.Username)) { 
            if(await VerifyExistingUsernameAsync(editUserDto.Username)) {
                throw new AlreadyExistsException("Username already exists");
            }
            user.Username = editUserDto.Username;
        }

        if (!user.Email.Equals(editUserDto.Email)) {
            if (await VerifyExistingEmailAsync(editUserDto.Email)) {
                throw new AlreadyExistsException("Email already exists");
            }
            user.Email = editUserDto.Email;
        }

        UserMapper.EditUser(user, editUserDto);

        await _dataContext.SaveChangesAsync();
    }

    public async Task DeleteUserByIdAsync(Guid id) {
        var user = await _dataContext.Users.FindAsync(id);

        if (user is null) {
            throw new ModelNotFoundException("User not found");
        }

        _dataContext.Users.Remove(user);
        await _dataContext.SaveChangesAsync();
    }

    public async Task<UserPaginationDto> GetUsersPaginatedAsync(int page) {
        var pageResults = 10d;
        var pageCount = Math.Ceiling(_dataContext.Users.Count() / pageResults);

        if (page < 1) {
            page = 1;
        }

        if (page > (int)pageCount) {
            page = (int)pageCount;
        }

        var users = await _dataContext.Users
            .Skip((page - 1) * (int)pageResults)
            .Take((int)pageResults)
            .Select(u => new GetUserDto {
                Username= u.Username,
                Email= u.Email,
                Address = u.Address,
                PhoneNumber = u.PhoneNumber,
                Country = u.Country,
                State = u.State,
                City = u.City,
                LastName = u.LastName,
                FirstName = u.FirstName,
            }).ToListAsync();

        if (users is null) {
            throw new ModelNotFoundException("Users not found");
        }

        var userPaginationDto = new UserPaginationDto {
            getUserDto = users,
            NumberOfUsers = _dataContext.Users.Count(),
            NumberOfPages = (int)pageCount,
        };

        return userPaginationDto;
    }

    public async Task<UserPaginationDto> GetSearchedUsersByUserNameAsync(UserSearchDto userSearchDto) {
        var pageResults = 10d;

        if(userSearchDto.Page < 1) {
            userSearchDto.Page = 1;
        }

        var usersQuery = _dataContext.Users
            .Where(u => u.Username.ToLower().Contains(userSearchDto.Search.ToLower()));

        var numberOfUsers = usersQuery.Count();

        var pageCount = Math.Ceiling(numberOfUsers / pageResults);

        if (userSearchDto.Page > (int)pageCount) {
            userSearchDto.Page = (int)pageCount;
        }

        if (numberOfUsers < pageResults) {
            pageResults = numberOfUsers;
        }

        var searchedUsers = await usersQuery
            .Skip((userSearchDto.Page - 1) * (int)pageResults)
            .Take((int)pageResults)
            .Select(u => new GetUserDto {
                Username = u.Username,
                Email = u.Email,
                Address = u.Address,
                PhoneNumber = u.PhoneNumber,
                Country = u.Country,
                State = u.State,
                City = u.City,
                LastName = u.LastName,
                FirstName = u.FirstName,
            }).ToListAsync();

        var userPaginationDto = new UserPaginationDto {
            getUserDto = searchedUsers,
            NumberOfUsers = numberOfUsers,
            NumberOfPages = (int)pageCount,
        };

        return userPaginationDto;
    }

    public async Task<UserPaginationDto> GetSearchedUsersByEmailAsync(UserSearchDto userSearchDto) {
        var pageResults = 10d;

        if (userSearchDto.Page < 1) {
            userSearchDto.Page = 1;
        }

        var usersQuery = _dataContext.Users.Where(u => u.Email.ToLower().Contains(userSearchDto.Search.ToLower()));

        var numberOfUsers = usersQuery.Count();
        var pageCount = Math.Ceiling(numberOfUsers / pageResults);

        if (userSearchDto.Page > (int)pageCount) {
            userSearchDto.Page = (int)pageCount;
        }

        if (numberOfUsers < pageResults) {
            pageResults = numberOfUsers;
        }

        var searchedUsers = await usersQuery
            .Skip((userSearchDto.Page - 1) * (int)pageResults)
            .Take((int)pageResults)
            .Select(u => new GetUserDto {
                Username = u.Username,
                Email = u.Email,
                Address = u.Address,
                PhoneNumber = u.PhoneNumber,
                Country = u.Country,
                State = u.State,
                City = u.City,
                LastName = u.LastName,
                FirstName = u.FirstName,
            }).ToListAsync();

        var userPaginationDto = new UserPaginationDto {
            getUserDto = searchedUsers,
            NumberOfUsers = numberOfUsers,
            NumberOfPages = (int)pageCount,
        };

        return userPaginationDto;
    }

    public async Task DeleteUserProfileDetailsAsync(string username) {
        var user = await _dataContext.Users.FirstOrDefaultAsync(u => u.Username.Equals(username));

        if (user is null) {
            throw new ModelNotFoundException("User not found");
        }

        _dataContext.Users.Remove(user);
        await _dataContext.SaveChangesAsync();
    }
}
