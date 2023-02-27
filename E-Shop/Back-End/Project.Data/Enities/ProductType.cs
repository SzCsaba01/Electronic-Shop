namespace Project.Data.Enities;
public enum ProductTypes {
    Laptop = 0,
    PC = 1,
    Phone = 2,
    TV = 3,
    PlayStation = 4,
    Xbox = 5,
    Component = 6,
    Software = 7
}
public class ProductType {
    public Guid Id { get; set; }
    public ProductTypes Type { get; set; }
    public ICollection<Product> Products { get; set; }
}
