namespace Project.Data.Dto.Email;
public class SendVerificationEmailDto {
    public string Email { get; set; }
    public string? Token { get; set; }
    public string? Uri { get; set; }
}
