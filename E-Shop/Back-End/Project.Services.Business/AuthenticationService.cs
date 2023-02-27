using Microsoft.EntityFrameworkCore;
using Project.Data.Data;
using Project.Data.Dto.Authentiaction;
using Project.Data.Dto.User;
using Project.Data.Enities;
using Project.Services.Business.Exceptions;
using Project.Services.Contracts;

namespace Project.Services.Business;
public class AuthenticationService : IAuthenticationService {
    private readonly DataContext _dataContext;
    private readonly IEncryptionService _encryptionService;
    private readonly IJwtService _jwtService;
    public AuthenticationService(DataContext dataContext, IEncryptionService encryptionService, IJwtService jwtService) {
        _dataContext = dataContext;
        _encryptionService = encryptionService;
        _jwtService = jwtService;
    }
    public async Task<AuthenticationResponseDto> LoginAsync(AuthenticationRequestDto authenticationRequestDto) {
        authenticationRequestDto.Password = _encryptionService.GeneratedHashedPassword(authenticationRequestDto.Password);

        var user = await _dataContext.Users
            .Where(u => (u.Username.Equals(authenticationRequestDto.UserCredentials) || u.Email.Equals(authenticationRequestDto.UserCredentials)) && u.Password.Equals(authenticationRequestDto.Password))
            .Select(u => new GetDetailsForLoginDto {
                Username = u.Username,
                Id = u.Id,
                Role = u.Role.RoleType,
                IsConfirmedRegistrationToken = (bool)u.isConfirmedRegistrationToken,
            })
            .FirstOrDefaultAsync();

        if (user is null) {
            throw new AuthenticationException("Username or Password is incorrect");
        }

        if (!(bool)user.IsConfirmedRegistrationToken) {
            throw new AuthenticationException("Email is not verified");
        }

        var token = await _jwtService.GetAuthentificationJwtAsync(user);
        return new AuthenticationResponseDto { Id = user.Id, Role = user.Role, Token = token };
    }
}
