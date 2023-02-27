using Project.Data.Enities;

namespace Project.Data.Dto.User;
public class GetDetailsForLoginDto {
    public Guid Id { get; set; }
    public string Username { get; set; }
    public RoleTypes Role { get; set; }
    public bool IsConfirmedRegistrationToken { get; set; }
}
