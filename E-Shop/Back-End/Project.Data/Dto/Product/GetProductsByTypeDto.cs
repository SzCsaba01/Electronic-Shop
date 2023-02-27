using Project.Data.Enities;

namespace Project.Data.Dto.Product;
public class GetProductsByTypeDto {
    public int Page { get; set; }
    public ProductTypes ProductType { get;set; }
}
