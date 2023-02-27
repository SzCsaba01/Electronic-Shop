namespace Project.Data.Dto.Product;
public class AddProductToFavoritesOrCart {
    public Guid userId { get; set; }
    public Guid productId { get; set; }
}
