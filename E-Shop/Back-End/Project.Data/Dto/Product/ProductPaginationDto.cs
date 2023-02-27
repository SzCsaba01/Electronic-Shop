namespace Project.Data.Dto.Product;
public class ProductPaginationDto {
    public ICollection<GetProductDto> Products { get; set; }
    public int NumberOfProducts { get; set; }
    public int NumberOfPages { get; set; }
}
