using Project.Data.Dto.Email;
using ToDoList.Data.Dto.Email;

namespace Project.Services.Contracts;
public interface IEmailService {
    Task SendVerificationEmail(SendVerificationEmailDto sendVerificationEmailDto);
    Task SendForgotPasswordEmailAsync(SendForgotPasswordEmailDto sendForgotPasswordEmailDto);
    string CreateForgotPasswordMessageBody(SendForgotPasswordEmailDto sendForgotPasswordEmailDto);
    string CreateVerificationMessageBody(SendVerificationEmailDto sendVerificationEmailDto);
}
