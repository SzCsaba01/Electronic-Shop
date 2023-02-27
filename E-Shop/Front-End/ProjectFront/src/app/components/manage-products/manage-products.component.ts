import { ReadVarExpr } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { take, takeUntil } from 'rxjs';
import { ProductTypes } from 'src/app/enums/ProductType';
import { AddProductDto } from 'src/app/models/Product/AddProductDto';
import { LoaderService } from 'src/app/services/loader.service';
import { ProductService } from 'src/app/services/product.service';
import { SelfUnsubscriberBase } from 'src/app/utils/SelfUnsubscriberBase';

@Component({
  selector: 'app-manage-products',
  templateUrl: './manage-products.component.html',
  styleUrls: ['./manage-products.component.scss']
})
export class ManageProductsComponent extends SelfUnsubscriberBase implements OnInit {

  formSubmitted = false;
  addProductForm: FormGroup;

  name: FormControl;
  price: FormControl;
  discount: FormControl;
  stock: FormControl;
  file: FormControl;
  productType: FormControl;

  addNewProduct: FormData; 

  productTypes!: ProductTypes[];

  ProductTypes = ProductTypes;

  constructor(
    private productService: ProductService,
    private loaderService: LoaderService,
  ) 
  { 
    super();

    this.addNewProduct = new FormData();

    this.name = new FormControl('', Validators.required);            
    this.price = new FormControl('', [Validators.required, Validators.min(1)]);
    this.discount = new FormControl('', [Validators.required, Validators.min(0), Validators.max(50)]);
    this.stock = new FormControl('', [Validators.required, Validators.min(0)]);
    this.file = new FormControl('', Validators.required);
    this.productType = new FormControl('', Validators.required);  

    this.addProductForm = new FormGroup({
      'name': this.name,
      'price': this.price,
      'discount': this.discount,
      'stock': this.stock,
      'file': this.file,
      'productType': this.productType
    });
  }

  ngOnInit() {
    this.productService.getProducts()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((result) => {
        this.productTypes = result;
      })
  }

  onUploadfile(files: any){
    if(files.length !== 0){
      const reader = new FileReader();
      var fileToUpload = <File>files[0];

      this.addNewProduct!.append('file', fileToUpload, fileToUpload.name);
    }

  }

  addProduct(product: AddProductDto) {
    this.addNewProduct!.append('name', product.name);
    this.addNewProduct!.append('price', product.price as unknown as string);
    this.addNewProduct!.append('discount', product.discount as unknown as string);
    this.addNewProduct!.append('stock', product.stock as unknown as string);
    this.addNewProduct!.append('productType', product.productType as unknown as string);

    this.loaderService.showLoader();
    this.productService.addProduct(this.addNewProduct)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
      this.formSubmitted = true;
      this.loaderService.hideLoader();
      this.addProductForm.reset();
      window.location.reload();
    });
  }

}
