using Project.Data.Dto.Product;
using Project.Data.Enities;

namespace Project.Services.Contracts;
public interface IProductService {
    public Task<List<ProductTypes>> GetProductTypesAsync();
    public Task<Boolean> VerifyExistingProductNameAsync(string productName);
    public Task AddProductAsync(AddProductDto addProductDto);
    public Task DeleteProductAsync(Guid id);
    public Task EditProductDetailsAsync(EditProductDto updateProductDto);
    public Task ChanageProductPictureAsync(ChangeProductPictureDto changeProductPictureDto);
    public Task<ProductPaginationDto> GetProductsPaginatedByTypeAsync(GetProductsByTypeDto getProductsByTypeDto);
    public Task<ProductPaginationDto> GetSearchedProductsByNameAsync(ProductSearchDto productSearchDto);
    public Task AddProductToFavoritesAsync(AddProductToFavoritesOrCart addProductToFavoritesOrCart);
    public Task AddProductToCartAsync(AddProductToFavoritesOrCart addProductToFavoritesOrCart);
    public Task RemoveProductFromCartAsync(AddProductToFavoritesOrCart addProductToFavoritesOrCart);
    public Task<ICollection<GetProductDto>> GetFavoriteProductsAsync(Guid id);
    public Task<ICollection<GetProductDto>> GetCartProductsAsync(Guid id);
    public Task AddNewOrderAsync(Guid id);
    public Task<ICollection<GetOrderedProductsDto>> GetOrderedProductsAsync(Guid id);
    public Task<GetProductDto> GetProductByIdAsync(Guid id);
    
}