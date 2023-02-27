using Microsoft.AspNetCore.Http;
using Project.Data.Enities;

namespace Project.Data.Dto.Product;
public class AddProductDto {
    public string Name { get; set; }
    public double Price { get; set; }
    public int Discount { get; set; }
    public int Stock { get; set; }
    public IFormFile file { get; set; }
    public ProductTypes ProductType { get; set; }
}
