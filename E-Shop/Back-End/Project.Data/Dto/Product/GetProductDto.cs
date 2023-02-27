using Project.Data.Enities;

namespace Project.Data.Dto.Product;
public class GetProductDto {
    public Guid Id { get; set; }
    public string Name { get; set; }
    public double Price { get; set; }
    public double? Discount { get; set; }
    public int Stock { get; set; }
    public string Picture { get; set; }
    public ProductTypes ProductType { get; set; }
}
