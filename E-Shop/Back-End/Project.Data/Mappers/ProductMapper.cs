using Project.Data.Dto.Product;
using Project.Data.Enities;

namespace Project.Data.Mappers;
public static class ProductMapper {
    public static Product ToProduct(AddProductDto addProductDto) {
        return new Product {
            Name = addProductDto.Name,
            Price = addProductDto.Price,
            Discount = addProductDto.Discount,
            Stock = addProductDto.Stock,
        };
    }
    public static void EditProduct(this Product product, EditProductDto editProductDto) {
        product.Name = editProductDto.Name;
        product.Price = editProductDto.Price;
        product.Discount = editProductDto.Discount;
        product.Stock = editProductDto.Stock;
    }
}
