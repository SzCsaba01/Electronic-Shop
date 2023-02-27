namespace Project.Data.Enities;
public class Order {
    public Guid Id { get; set; }
    public DateTime TimeCreated { get; set; }
    public double TotalPrice { get; set; }
    public ICollection<Product> Products { get; set; }
    public User User { get; set; }
}
