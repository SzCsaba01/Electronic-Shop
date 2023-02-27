using Microsoft.AspNetCore.Http;

namespace Project.Data.Dto.User;
public class ChangeProfilePictureDto {
    public Guid UserId { get; set; }
    public IFormFile File { get; set; }
}
