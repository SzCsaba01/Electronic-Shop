using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Project.Data.Dto.Authentiaction;
using Project.Data.Dto.User;
using Project.Services.Contracts;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Project.Services.Business;
public class JwtService : IJwtService {
    public readonly IConfiguration _configuration;
    public JwtService(IConfiguration configuration) {
        _configuration = configuration;
    }
    public async Task<string> GenerateJwtTokenAsync(GenerateJwtDto generateJwtDto) {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_configuration.GetSection("Jwt:Key").Value);
        var tokenDescriptor = new SecurityTokenDescriptor {
            Subject = generateJwtDto.Claims,
            Expires = generateJwtDto.ExpirationDate,
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);

        return tokenHandler.WriteToken(token);
    }

    public async Task<string> GetAuthentificationJwtAsync(GetDetailsForLoginDto user) {
        var claimsIdentity = new ClaimsIdentity(new[] { 
            new Claim("id", user.Id.ToString()), 
            new Claim(ClaimTypes.Name, user.Username), 
            new Claim(ClaimTypes.Role, user.Role.ToString()) });
        var expires = DateTime.UtcNow.AddHours(6);

        var generateJwtDto = new GenerateJwtDto {
            Claims = claimsIdentity,
            ExpirationDate = expires
        };
        
        return await GenerateJwtTokenAsync(generateJwtDto);
    }
}
