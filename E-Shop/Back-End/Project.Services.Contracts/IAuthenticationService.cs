using Project.Data.Dto.Authentiaction;

namespace Project.Services.Contracts;
public interface IAuthenticationService {
    Task<AuthenticationResponseDto> LoginAsync(AuthenticationRequestDto authenticationRequestDto);
}
