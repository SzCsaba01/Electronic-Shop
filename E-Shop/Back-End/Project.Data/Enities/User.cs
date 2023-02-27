namespace Project.Data.Enities;
public class User {
    public Guid Id { get; set; }
    public string Username { get; set; }
    public string Email { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string City { get; set; }
    public string Country { get; set; }
    public string State { get; set; }
    public string Address { get; set; }
    public string PhoneNumber { get; set; }
    public string? ProfilePicture { get; set; }
    public string? ResetPasswordToken { get; set; }
    public DateTime? ResetPasswordTokenGenerationTime { get; set; }
    public string? RegistrationToken { get; set; }
    public bool? isConfirmedRegistrationToken { get; set; }
    public string Password { get; set; }
    public Role Role { get; set; }
    public ICollection<Order> Orders { get; set; }
    public ICollection<Product> FavoriteProducts { get; set;}
    public ICollection<Product> Cart { get; set; }
}
