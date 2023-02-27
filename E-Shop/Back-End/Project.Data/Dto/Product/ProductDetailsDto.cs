using Project.Data.Enities;

namespace Project.Data.Dto.Product;
public class ProductDetailsDto {
    public Guid ProductId { get; set; }
    public string Name { get; set; }
    public double Price { get; set; }
    public int Discount { get; set; }
    public int Stock { get; set; }
    public string Picture { get; set; }
    public ProductTypes ProductType { get; set; }
}
