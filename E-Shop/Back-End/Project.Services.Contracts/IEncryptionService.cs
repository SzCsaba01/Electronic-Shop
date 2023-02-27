namespace Project.Services.Contracts;
public interface IEncryptionService {
    public string GeneratedHashedPassword(string password);
}
