namespace Project.Data.Dto.Product;
public class GetOrderedProductsDto {
    public double TotalPrice { get; set; }
    public DateTime Time { get; set; }
    public ICollection<GetProductDto> Products { get; set; }
}
