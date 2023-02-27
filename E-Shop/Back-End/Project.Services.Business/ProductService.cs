using Microsoft.EntityFrameworkCore;
using Project.Data;
using Project.Data.Data;
using Project.Data.Dto.Product;
using Project.Data.Enities;
using Project.Data.Mappers;
using Project.Services.Business.Exceptions;
using Project.Services.Contracts;

namespace Project.Services.Business;
public class ProductService : IProductService {
    private readonly DataContext _dataContext;
    public ProductService(DataContext dataContext) {
        _dataContext = dataContext;
    }

    public async Task<bool> VerifyExistingProductNameAsync(string productName) {
        var product = await _dataContext.Products.FirstOrDefaultAsync(p => p.Name.Equals(productName));
        if (product is null) {
            return false;
        }
        return true;
    }

    public async Task<List<ProductTypes>> GetProductTypesAsync() {
        var productTypes = await _dataContext.ProductTypes
            .Select(p => p.Type)
            .ToListAsync();

        if (productTypes is null) {
            throw new ModelNotFoundException("Product types not found");
        }

        return productTypes;
    }

    public async Task AddProductAsync(AddProductDto addProductDto) {
        if(addProductDto.Name is null) {
            throw new ModelNotFoundException("Error adding product");
        }

        if (await VerifyExistingProductNameAsync(addProductDto.Name)) {
            throw new AlreadyExistsException("Product name already exists");
        }

        var newProduct = ProductMapper.ToProduct(addProductDto);

        var productType = await _dataContext.ProductTypes.Where(p => p.Type == addProductDto.ProductType).FirstOrDefaultAsync();
        
        if (productType is null) {
            throw new ModelNotFoundException("Product type not found");
        }

        var file = addProductDto.file;
        var folderName = Path.Combine(AppConstants.RESOURCES, AppConstants.PRODUCT_IMAGES);
        var pathToSave = Path.Combine(Directory.GetParent(Directory.GetCurrentDirectory()).FullName, AppConstants.RESOURCE_FOLDER, folderName);

        if (file.Length <= 0) {
            throw new ModelNotFoundException("File not found");
        }

        var fileName = file.FileName;
        var fullPath = Path.Combine(pathToSave, fileName);
        var dbPath = Path.Combine(folderName, fileName);

        var oldFile = await _dataContext.Products
            .Where(p => p.Name.Equals(addProductDto.Name))
            .Select(p => p.Picture)
            .FirstOrDefaultAsync();

        if (oldFile is not null) {

            oldFile = Path.Combine(Directory.GetParent(Directory.GetCurrentDirectory()).FullName, AppConstants.RESOURCE_FOLDER, oldFile);

            if (File.Exists(oldFile)) {
                File.Delete(oldFile);
            }
        }

        using(var stream = new FileStream(fullPath, FileMode.Create)) {
            file.CopyTo(stream);
        }

        newProduct.Picture = dbPath;
        newProduct.ProductType = productType;
        await _dataContext.Products.AddAsync(newProduct);
        await _dataContext.SaveChangesAsync();
    }

    public async Task DeleteProductAsync(Guid id) {
        var product = await _dataContext.Products.FindAsync(id);

        if (product is null) {
            throw new ModelNotFoundException("Product not found");
        }

        var oldFile = await _dataContext.Products
            .Where(p => p.Name.Equals(product.Name))
            .Select(p => p.Picture)
            .FirstOrDefaultAsync();

        if (oldFile is not null) {

            oldFile = Path.Combine(Directory.GetParent(Directory.GetCurrentDirectory()).FullName, AppConstants.RESOURCE_FOLDER, oldFile);

            if (File.Exists(oldFile)) {
                File.Delete(oldFile);
            }
        }

        _dataContext.Products.Remove(product);
        await _dataContext.SaveChangesAsync();
    }

    public async Task EditProductDetailsAsync(EditProductDto updateProductDto) {
        var product = await _dataContext.Products.FindAsync(updateProductDto.ProductId);

        if (product is null) {
            throw new ModelNotFoundException("Product not found");
        }

        if (!product.Name.Equals(updateProductDto.Name)) {
            if (await VerifyExistingProductNameAsync(updateProductDto.Name)) {
                throw new AlreadyExistsException("Product name already exists");
            }
            product.Name = updateProductDto.Name;
        }

        var productType = await _dataContext.ProductTypes.Where(p => p.Type == updateProductDto.ProductType).FirstOrDefaultAsync();

        if (productType is null) {
            throw new ModelNotFoundException("Product type not found");
        }

        ProductMapper.EditProduct(product, updateProductDto);
        product.ProductType = productType;

        await _dataContext.SaveChangesAsync();
    }

    public async Task ChanageProductPictureAsync(ChangeProductPictureDto changeProductPictureDto) {
        var file = changeProductPictureDto.File;
        var folderName = Path.Combine(AppConstants.RESOURCES, AppConstants.PRODUCT_IMAGES);
        var pathToSave = Path.Combine(Directory.GetParent(Directory.GetCurrentDirectory()).FullName, AppConstants.RESOURCE_FOLDER, folderName);

        if (file.Length <= 0) {
            throw new ModelNotFoundException("File not found");
        }

        var fileName = file.FileName;
        var fullPath = Path.Combine(pathToSave, fileName);
        var dbPath = Path.Combine(folderName, fileName);

        var oldFile = await _dataContext.Products
            .Where(p => p.Id == changeProductPictureDto.ProductId)
            .Select(p => p.Picture)
            .FirstOrDefaultAsync();

        if (oldFile is not null) {

            oldFile = Path.Combine(Directory.GetParent(Directory.GetCurrentDirectory()).FullName, AppConstants.RESOURCE_FOLDER, oldFile);

            if (File.Exists(oldFile)) {
                File.Delete(oldFile);
            }
        }

        using (var stream = new FileStream(fullPath, FileMode.Create)) {
            file.CopyTo(stream);
        }

        var product = await _dataContext.Products.FindAsync(changeProductPictureDto.ProductId);

        if (product is null) {
            throw new ModelNotFoundException("User not found");
        }

        product.Picture = dbPath;
        await _dataContext.SaveChangesAsync();
    }

    public async Task<ProductPaginationDto> GetProductsPaginatedByTypeAsync(GetProductsByTypeDto getProductsByTypeDto) {
        var pageResults = 12d;

        var productType = await _dataContext.ProductTypes.FirstOrDefaultAsync(pt => pt.Type == getProductsByTypeDto.ProductType);

        if (productType is null) {
            throw new ModelNotFoundException("Product type not found");
        }
        var pageCount = Math.Ceiling(_dataContext.Products.Where(p => p.ProductType == productType).Count() / pageResults);

        var products = await _dataContext.Products
            .Where(p => p.ProductType == productType)
            .Skip((getProductsByTypeDto.Page - 1) * (int)pageResults)
            .Take((int)pageResults)
            .Select(p => new GetProductDto {
                Id = p.Id,
                Name = p.Name,
                Price = p.Price,
                Discount = p.Discount,
                Picture = Path.Combine(AppConstants.APP_URL, p.Picture),
                ProductType = p.ProductType.Type,
                Stock = p.Stock,
            }).ToListAsync();
        
        if (products is null) {
            throw new ModelNotFoundException("Products not found");
        }

        var productPaginationDto = new ProductPaginationDto {
            Products = products,
            NumberOfProducts = _dataContext.Products.Where(p => p.ProductType == productType).Count(),
            NumberOfPages = (int)pageCount,
        };

        return productPaginationDto;
    }

    public async Task<ProductPaginationDto> GetSearchedProductsByNameAsync(ProductSearchDto productSearchDto){
        var pageResults = 12d;

        if(productSearchDto.Page < 1) {
            productSearchDto.Page = 1;
        }

        var productsQuery = _dataContext.Products
            .Where(p => p.Name.ToLower().Contains(productSearchDto.Search.ToLower()));

        var numberOfProducts = productsQuery.Count();

        var pageCount = Math.Ceiling(numberOfProducts / pageResults);

        if (productSearchDto.Page > (int)pageCount) {
            productSearchDto.Page = (int)pageCount;
        }

        if (numberOfProducts < pageResults) {
            pageResults = numberOfProducts;
        }

        var searchedProducts = await productsQuery
            .Skip((productSearchDto.Page - 1)* (int)pageResults)
            .Take((int)pageResults)
            .Select(p => new GetProductDto {
                Id = p.Id,
                Name = p.Name,
                Price = p.Price,
                Discount = p.Discount,
                Picture = Path.Combine(AppConstants.APP_URL, p.Picture),
                ProductType = p.ProductType.Type,
            }).ToListAsync();

        var productPaginationDto = new ProductPaginationDto {
            Products = searchedProducts,
            NumberOfProducts = numberOfProducts,
            NumberOfPages = (int)pageCount,
        };

        return productPaginationDto;
    }

    public async Task AddProductToFavoritesAsync(AddProductToFavoritesOrCart addProductToFavoritesOrCart) {
        var user = await _dataContext.Users
            .Include(u => u.FavoriteProducts)
            .FirstOrDefaultAsync(u => u.Id == addProductToFavoritesOrCart.userId);

        if (user is null) {
            throw new AuthenticationException("You have to be log in first");
        }

        var product = await _dataContext.Products
            .Include(p => p.ProductType)
            .FirstOrDefaultAsync(p => p.Id == addProductToFavoritesOrCart.productId);

        if (user.FavoriteProducts is null) {
            user.FavoriteProducts = new List<Product>();
        }

        if (user.FavoriteProducts.Contains(product)) {
            user.FavoriteProducts.Remove(product);
        }
        else {
            user.FavoriteProducts.Add(product);
        }

        await _dataContext.SaveChangesAsync();
    }

    public async Task AddProductToCartAsync(AddProductToFavoritesOrCart addProductToFavoritesOrCart) {
        var user = await _dataContext.Users
            .Include(u => u.Cart)
            .FirstOrDefaultAsync(u => u.Id == addProductToFavoritesOrCart.userId);

        if (user is null) {
            throw new AuthenticationException("You have to log in first");
        }


        var product = await _dataContext.Products
            .Include(p => p.ProductType)
            .FirstOrDefaultAsync(p => p.Id == addProductToFavoritesOrCart.productId);

        if (product is null) {
            throw new Exception("Product not found");
        }

        user.Cart.Add(product);

        await _dataContext.SaveChangesAsync();
    }

    public async Task RemoveProductFromCartAsync(AddProductToFavoritesOrCart addProductToFavoritesOrCart) {
        var user = await _dataContext.Users.FindAsync(addProductToFavoritesOrCart.userId);

        if (user is null) {
            throw new ModelNotFoundException("User not found");
        }

        var product = await _dataContext.Products.FindAsync(addProductToFavoritesOrCart.productId);

        if (product is null) {
            throw new ModelNotFoundException("Product not found");
        }

        if (!user.Cart.Contains(product)) {
            throw new ModelNotFoundException("Product is not in Cart");
        }

        user.Cart.Remove(product);

        await _dataContext.SaveChangesAsync();
    }

    public async Task<ICollection<GetProductDto>> GetFavoriteProductsAsync(Guid id) {
        var products = await _dataContext.Users
            .Where(u => u.Id == id)
            .Select(u => u.FavoriteProducts)
            .FirstOrDefaultAsync();

        if (products is null) {
            throw new AuthenticationException("No Products in Favorites");
        }

        var getProductDto = products
            .Select(p => new GetProductDto {
                Id = p.Id,
                Name = p.Name,
                Price = p.Price,
                Discount = p.Discount,
                Picture = Path.Combine(AppConstants.APP_URL, p.Picture),
            }).ToList();

        return getProductDto;
    }

    public async Task<ICollection<GetProductDto>> GetCartProductsAsync(Guid id) {
        var products = await _dataContext.Users
            .Where(u => u.Id == id)
            .Select(u => u.Cart)
            .FirstOrDefaultAsync();

        if (products is null) {
            throw new AuthenticationException("No Products in Cart");
        }

        var getProductDto = products
            .Select(p => new GetProductDto {
                Id = p.Id,
                Name = p.Name,
                Price = p.Price,
                Discount = p.Discount,
                Picture = Path.Combine(AppConstants.APP_URL, p.Picture),
            }).ToList();

        return getProductDto;
    }

    public async Task AddNewOrderAsync(Guid id) {
        var user = await _dataContext.Users
            .Include(u => u.Orders)
            .Include(u => u.Cart)
            .FirstOrDefaultAsync(u => u.Id == id);
        
        if (user is null) {
            throw new ModelNotFoundException("User not found");
        }

        var totalPrice = 0d;

        if (user.Cart.Count == 0) {
            throw new ModelNotFoundException("The cart is empty");
        }

        var newOrderProducts = new List<Product>();

        foreach(var product in user.Cart) {
            var tmp = await _dataContext.Products
                        .Include(p => p.Orders)
                        .FirstOrDefaultAsync(p => p.Id == product.Id);

            if (tmp is null) {
                throw new ModelNotFoundException("Product not found");
            }

            if (tmp.Stock <= 0) {
                throw new ModelNotFoundException("Product out of stock");
            }

            tmp.Stock--;
            if (tmp.Discount > 0) {
                totalPrice += tmp.Price - (tmp.Price * 1/(double)tmp.Discount);
            }
            else {
                totalPrice += tmp.Price;
            }

            newOrderProducts.Add(tmp);
        }

        var newOrder = new Order {
            Products = newOrderProducts,
            TotalPrice = totalPrice,
            TimeCreated = DateTime.UtcNow,
            User = user,
        };

        await _dataContext.Orders.AddAsync(newOrder);

        user.Orders.Add(newOrder);

        user.Cart.Clear();

        await _dataContext.SaveChangesAsync();
    }

    public async Task<ICollection<GetOrderedProductsDto>> GetOrderedProductsAsync(Guid id) {
        var orders = await _dataContext.Orders
            .Include(o => o.Products)
            .Where(o => o.User.Id == id)
            .ToListAsync();

        var orderedProducts = orders
            .Select(o => new GetOrderedProductsDto {
                Time = o.TimeCreated,
                TotalPrice = o.TotalPrice,
                Products = o.Products.Select(p => new GetProductDto {
                    Name = p.Name,
                    Id = p.Id,
                    Picture = Path.Combine(AppConstants.APP_URL, p.Picture)
                }).ToList()
            }).ToList();

        if (orderedProducts is null) {
            throw new ModelNotFoundException("Order not found");
        }

        return orderedProducts;
    }

    public async Task<GetProductDto> GetProductByIdAsync(Guid id) {
        var product = await _dataContext.Products
            .Where(p => p.Id == id)
            .Include(p => p.ProductType)
            .Select(p => new GetProductDto {
                Name = p.Name,
                Price = p.Price,
                Id = p.Id,
                Picture = Path.Combine(AppConstants.APP_URL, p.Picture),
                Discount = p.Discount,
                ProductType = p.ProductType.Type
            }).FirstOrDefaultAsync();

        if (product is null) {
            throw new ModelNotFoundException("Product not found");
        }

        return product;
    }
}
