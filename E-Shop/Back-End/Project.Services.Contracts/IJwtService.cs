
using Project.Data.Dto.Authentiaction;
using Project.Data.Dto.User;

namespace Project.Services.Contracts;
public interface IJwtService {
    Task<string> GetAuthentificationJwtAsync(GetDetailsForLoginDto user);
    Task<string> GenerateJwtTokenAsync(GenerateJwtDto generateJwtDto);
}
