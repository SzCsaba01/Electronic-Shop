using Project.Data.Enities;

namespace Project.Data.Dto.Authentiaction;
public class AuthenthicationJwtDto {
    public Guid Id { get; set; }
    public string Username { get; set; }
    public string Password { get; set; }
    public RoleTypes Role { get; set; }
}
