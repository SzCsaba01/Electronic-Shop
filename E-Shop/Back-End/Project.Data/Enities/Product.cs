namespace Project.Data.Enities;
public class Product {
    public Guid Id { get; set; }
    public string Name { get; set; }
    public double Price { get; set; }
    public double? Discount { get; set; }
    public int Stock { get; set; }
    public string Picture { get; set; }
    public ProductType ProductType { get; set; }
    public ICollection<Order>? Orders { get; set; }
}
