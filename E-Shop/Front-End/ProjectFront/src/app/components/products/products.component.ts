import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { takeUntil } from 'rxjs';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ProductTypes } from 'src/app/enums/ProductType';
import { GetProductsByTypeDto } from 'src/app/models/Product/GetProductsByTypeDto';
import { ProductService } from 'src/app/services/product.service';
import { SelfUnsubscriberBase } from 'src/app/utils/SelfUnsubscriberBase';
import { AppConstants } from 'src/app/constants/AppConstants';
import { ProductSearchDto } from 'src/app/models/Product/ProductSearchDto';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GetProductDto } from 'src/app/models/Product/GetProductDto';
import { ChangeProductPictureDto } from 'src/app/models/Product/ChangeProductPictureDto';
import { Guid } from 'guid-typescript';
import { EditProductDto } from 'src/app/models/Product/EditProductDto';
import { AddProductToFavoritesOrCart } from 'src/app/models/Product/AddProductToFavoritesOrCart';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent extends SelfUnsubscriberBase implements OnInit {

  productsType = this.activatedRoute.snapshot.paramMap.get("productType") as unknown as ProductTypes;

  ProductTypes = ProductTypes;
  productTypes!: ProductTypes[];

  getProductsByTypeDto: GetProductsByTypeDto;

  totalNumberOfPages!: number;
  totalNumberOfProducts!: number;
  currentNumberOfProductsStartRow: number = 1;
  currentNumberOfProductsEndRow!: number;

  numberOfColumns = AppConstants.PRODUCTS_PER_ROW

  rowData!: any;

  userId = localStorage.getItem('id') as unknown as Guid;

  isShownDeleteModal: boolean = false;
  isShownEditModal: boolean = false;

  searchedProductsByName : string = "";

  name: FormControl;
  price: FormControl;
  discount: FormControl;
  stock: FormControl;
  productType: FormControl;

  editProductForm: FormGroup;

  private removeProductId?: Guid;

  private editProductId?: Guid;

  changeProductPictureDto: ChangeProductPictureDto;

  productPicture!: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private productService : ProductService,
    private route: Router,
  ) {
    super();

    this.changeProductPictureDto = new ChangeProductPictureDto();
    this.changeProductPictureDto.file = new FormData();
    
    this.getProductsByTypeDto = new GetProductsByTypeDto();
    this.getProductsByTypeDto.productType = ProductTypes[this.productsType] as unknown as number;
    this.getProductsByTypeDto.page = 1;

    this.name = new FormControl('', Validators.required);            
    this.price = new FormControl('', [Validators.required, Validators.min(1)]);
    this.discount = new FormControl('', [Validators.required, Validators.min(0), Validators.max(50)]);
    this.stock = new FormControl('', [Validators.required, Validators.min(0)]);
    this.productType = new FormControl('', Validators.required);  

    this.editProductForm = new FormGroup({
      'name': this.name,
      'price': this.price,
      'discount': this.discount,
      'stock': this.stock,
      'productType': this.productType
    });
  }

  ngOnInit(): void {
    this.rowData = 0;
    this.getPaginatedProducts(-2);

    this.productService.getProducts()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((result) => {
      this.productTypes = result;
    })

  }

  onViewProductDetails(product: GetProductDto){
    this.route.navigate(['/product-detail/', product.id])
  }

  changeShowDeleteModal(product: GetProductDto){
    this.isShownDeleteModal = !this.isShownDeleteModal;
    this.removeProductId = product.id;
  }

  changeShowEditModal(product: GetProductDto){
    this.isShownEditModal = !this.isShownEditModal;
    this.editProductId = product.id;
    this.initializeForm(product);
  }

  closeShowDeleteModal(){
    this.isShownDeleteModal = false;
  }

  closeShowEditModal(){
    this.isShownEditModal = false;
  }

  onRemoveProduct(){
    this.isShownDeleteModal = !this.isShownDeleteModal;
    this.productService.deleteProduct(this.removeProductId!)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.getProductsByTypeDto.page = 1;
        this.getPaginatedProducts(-2);
      })
  }

  onEditProduct(editProductDto: EditProductDto){
    this.isShownEditModal = !this.isShownEditModal;
    editProductDto.productId = this.editProductId!;
    this.productService.editProduct(editProductDto)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.editProductForm.reset();
        this.getProductsByTypeDto.page = 1;
        this.getPaginatedProducts(-2);
      })
  }

  onAddingToCart(product: GetProductDto){
    var addToCart = new AddProductToFavoritesOrCart();
    addToCart.productId = product.id;
    addToCart.userId = this.userId;
    
    this.productService.addProductToCart(addToCart)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe();
  }

  onAddingToFavorites(product: GetProductDto){
    var addToFavorites = new AddProductToFavoritesOrCart();
    addToFavorites.productId = product.id;
    addToFavorites.userId = this.userId;
    
    this.productService.addProductToFavorites(addToFavorites)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe();
  }

  onChangeProductPicture(files: any){
    if(files.length !== 0){
      const reader = new FileReader();
      var fileToUpload = <File>files[0];

      reader.readAsDataURL(fileToUpload);
      this.changeProductPictureDto.file.append('file', fileToUpload, fileToUpload.name);
      this.changeProductPictureDto.file.append('productId', this.changeProductPictureDto.productId as unknown as string);
      
      reader.onload = () => {
        this.productPicture = reader.result as string;
      }
    }
  }

  onSaveProductPicture(){
    if(!this.changeProductPictureDto.file){
      return;
    }
    this.productService.changeProductPicture(this.changeProductPictureDto.file)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.getProductsByTypeDto.page = 1;
        this.getPaginatedProducts(-2);
      });
  }

  initializeForm(product: GetProductDto){
    this.name.setValue(product.name);
    this.price.setValue(product.price);
    this.discount.setValue(product.discount);
    this.stock.setValue(product.stock);
    this.productType.setValue(product.productType);

    this.productPicture = product.picture;
    this.changeProductPictureDto.productId = product.id;

    this.editProductForm.patchValue({
      'name': this.name.value,
      'price': this.price.value,
      'discount': this.discount.value,
      'stock': this.stock.value,
      'productType': this.productType.value,
    })
  }

  nextPage(){
    this.getProductsByTypeDto.page++;

    if(this.searchedProductsByName){
      this.getSearchedProductsByName(1);
      return;
    }

    this.getPaginatedProducts(1);
  }

  lastPage(){
    this.getProductsByTypeDto.page = this.totalNumberOfPages;

    if(this.searchedProductsByName){
      this.getSearchedProductsByName(2);
      return;
    }

    this.getPaginatedProducts(2);
  }

  previousPage(){
    this.getProductsByTypeDto.page--;

    if(this.searchedProductsByName){
      this.getSearchedProductsByName(-1);
      return;
    }

    this.getPaginatedProducts(-1);
  }

  firstPage(){
    this.getProductsByTypeDto.page = 1;

    if(this.searchedProductsByName){
      this.getSearchedProductsByName(-2);
      return;
    }

    this.getPaginatedProducts(-2);
  }

  onSearchProductsByName(searchProduct: string){
    this.searchedProductsByName = searchProduct;
    this.getProductsByTypeDto.page = 1;

    if(this.searchedProductsByName){
     this.getSearchedProductsByName(-2);
     return;
    }

    this.getPaginatedProducts(-2);
  }


  getPaginatedProducts(direction: number){
    this.productService.getProductsPaginatedByType(this.getProductsByTypeDto)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {

        var numberOfNewProducts = result.products.length;
        var numberOfOldProducts = this.rowData.length;

        this.totalNumberOfPages = result.numberOfPages;
        this.totalNumberOfProducts = result.numberOfProducts;

        switch(direction){
          case -2:
            this.currentNumberOfProductsStartRow = 1;
            this.currentNumberOfProductsEndRow = numberOfNewProducts;
            break;
          case -1:
            this.currentNumberOfProductsEndRow -= numberOfOldProducts;
            this.currentNumberOfProductsStartRow -= numberOfNewProducts ;
            break;
          case 1:
            this.currentNumberOfProductsStartRow += numberOfOldProducts;
            this.currentNumberOfProductsEndRow += numberOfNewProducts;
            break;
          case 2:
            this.currentNumberOfProductsStartRow = this.totalNumberOfProducts - numberOfNewProducts + 1;
            this.currentNumberOfProductsEndRow = this.totalNumberOfProducts;
            break;
          default:
            this.currentNumberOfProductsStartRow = 0;
            this.currentNumberOfProductsEndRow = numberOfOldProducts;
        }
        this.rowData = result.products;
      })
  }

  getSearchedProductsByName(direction: number){
    var searchedProducts = new ProductSearchDto();
    searchedProducts.page = this.getProductsByTypeDto.page;
    searchedProducts.search = this.searchedProductsByName;

    this.productService.getSearchedProductsByName(searchedProducts)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        
        var numberOfNewProducts = result.products.length;
        var numberOfOldProducts = this.rowData.length;

        this.totalNumberOfPages = result.numberOfPages;
        this.totalNumberOfProducts = result.numberOfProducts;

        switch(direction){
          case -2:
            this.currentNumberOfProductsStartRow = 1;
            this.currentNumberOfProductsEndRow = numberOfNewProducts;
            break;
          case -1:
            this.currentNumberOfProductsEndRow -= numberOfOldProducts;
            this.currentNumberOfProductsStartRow -= numberOfNewProducts ;
            break;
          case 1:
            this.currentNumberOfProductsStartRow += numberOfOldProducts;
            this.currentNumberOfProductsEndRow += numberOfNewProducts;
            break;
          case 2:
            this.currentNumberOfProductsStartRow = this.totalNumberOfProducts - numberOfNewProducts + 1;
            this.currentNumberOfProductsEndRow = this.totalNumberOfProducts;
            break;
          default:
            this.currentNumberOfProductsStartRow = 0;
            this.currentNumberOfProductsEndRow = numberOfOldProducts;
        }
        this.rowData = result.products;
      })
    }

}
