using Project.Data.Enities;

namespace Project.Data.Dto.Authentiaction;
public class AuthenticationResponseDto {
    public Guid Id { get; set; }
    public string Token { get; set; }
    public RoleTypes Role { get; set; }
}