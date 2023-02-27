using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Project.Data.Dto.Product;
using Project.Data.Dto.User;
using Project.Services.Business;
using Project.Services.Contracts;

namespace Project.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ProductController : ControllerBase {
    private readonly IProductService _productService;
    public ProductController(IProductService productService) {
        _productService = productService;
    }

    [HttpGet("ProductTypes")]
    public async Task<IActionResult> GetProductTypesAsync() {
        return Ok(await _productService.GetProductTypesAsync());
    }

    [HttpPost("AddProduct")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> AddProductAsync([FromForm] AddProductDto addProductDto) {
        await _productService.AddProductAsync(addProductDto);
        return Ok("Succesfully added a new product");
    }

    [HttpDelete("DeleteProduct")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteProductAsync(Guid id) {
        await _productService.DeleteProductAsync(id);
        return Ok();
    }

    [HttpPut("EditProduct")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> EditProductDetailsAsync(EditProductDto updateProductDto) {
        await _productService.EditProductDetailsAsync(updateProductDto);
        return Ok();
    }

    [HttpPut("ChangeProductPicture")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> ChanageProductPictureAsync([FromForm]ChangeProductPictureDto changeProductPictureDto) {
        await _productService.ChanageProductPictureAsync(changeProductPictureDto);
        return Ok();
    }

    [HttpPost("SearchProductsByName")]
    public async Task<IActionResult> GetSearchedProductsByNameAsync(ProductSearchDto productSearchDto) {
        return Ok(await _productService.GetSearchedProductsByNameAsync(productSearchDto));
    }

    [HttpPost("PaginatedProducts")]
    public async Task<IActionResult> GetProductsPaginatedByTypeAsync(GetProductsByTypeDto getProductsByTypeDto) {
        return Ok(await _productService.GetProductsPaginatedByTypeAsync(getProductsByTypeDto));
    }

    [HttpPost("AddProductToFavorites")]
    [Authorize(Roles = "User,Admin")]
    public async Task<IActionResult> AddProductToFavoritesAsync(AddProductToFavoritesOrCart addProductToFavoritesOrCart) {
        await _productService.AddProductToFavoritesAsync(addProductToFavoritesOrCart);
        return Ok();
    }

    [HttpPost("AddProductToCart")]
    [Authorize(Roles = "User,Admin")]
    public async Task<IActionResult> AddProductToCartAsync(AddProductToFavoritesOrCart addProductToFavoritesOrCart) {
        await _productService.AddProductToCartAsync(addProductToFavoritesOrCart);
        return Ok();
    }

    [HttpPost("RemoveProductFromCart")]
    [Authorize(Roles = "User,Admin")]
    public async Task<IActionResult> RemoveProductFromCartAsync(AddProductToFavoritesOrCart addProductToFavoritesOrCart) {
        await _productService.RemoveProductFromCartAsync(addProductToFavoritesOrCart);
        return Ok();
    }

    [HttpPost("GetFavoriteProducts")]
    [Authorize(Roles = "User,Admin")]
    public async Task<IActionResult> GetFavoriteProductsAsync(Guid id) {
        return Ok(await _productService.GetFavoriteProductsAsync(id));
    }

    [HttpPost("GetCartProducts")]
    [Authorize(Roles = "User,Admin")]
    public async Task<IActionResult> GetCartProductsAsync(Guid id) {
        return Ok(await _productService.GetCartProductsAsync(id));
    }

    [HttpPost("GetOrderedProducts")]
    [Authorize(Roles = "User,Admin")]
    public async Task<IActionResult> GetOrderedProductsAsync(Guid id) {
        return Ok(await _productService.GetOrderedProductsAsync(id));
    }

    [HttpPut("AddNewOrder")]
    [Authorize(Roles = "User,Admin")]
    public async Task<IActionResult> AddNewOrderAsync(Guid id) {
        await _productService.AddNewOrderAsync(id);
        return Ok("Successfully added a new order");
    }

    [HttpGet("GetProductById")]
    public async Task<IActionResult> GetProductByIdAsync(Guid id) {
        return Ok(await _productService.GetProductByIdAsync(id));
    }
}
