using Project.Services.Contracts;
using System.Security.Cryptography;

namespace Project.Services.Business;
public class TokenService : ITokenService {
    public async Task<string> GenerateRandomTokenAsync() {
        return Convert.ToHexString(RandomNumberGenerator.GetBytes(64));
    }
}
