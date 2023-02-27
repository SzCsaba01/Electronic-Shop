namespace ToDoList.Data.Dto.Email;
public class SendForgotPasswordEmailDto {
    public string Email { get; set; }
    public string? Token { get; set; }
    public string? Uri { get; set; }
}
