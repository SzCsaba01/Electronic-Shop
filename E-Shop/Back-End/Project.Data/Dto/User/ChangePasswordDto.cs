namespace Project.Data.Dto.User;

public class ChangePasswordDto {
    public Guid Id { get; set; }
    public string newPassword { get; set; }
    public string repeatNewPassword { get; set; }
}

