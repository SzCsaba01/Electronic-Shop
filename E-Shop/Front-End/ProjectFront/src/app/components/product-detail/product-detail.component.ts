import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { takeUntil } from 'rxjs';
import { ProductTypes } from 'src/app/enums/ProductType';
import { AddProductToFavoritesOrCart } from 'src/app/models/Product/AddProductToFavoritesOrCart';
import { GetProductDto } from 'src/app/models/Product/GetProductDto';
import { ProductService } from 'src/app/services/product.service';
import { SelfUnsubscriberBase } from 'src/app/utils/SelfUnsubscriberBase';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent extends SelfUnsubscriberBase implements OnInit {

  productId = this.activeRoute.snapshot.paramMap.get("productId") as unknown as Guid;

  productDetails!: GetProductDto

  ProductType = ProductTypes;

  private userId : Guid = localStorage.getItem('id') as unknown as Guid;

  constructor(
    private activeRoute: ActivatedRoute,
    private productService: ProductService,
    private route: Router
  ){
    super();
  }

  ngOnInit(): void {
    this.productService.getProductById(this.productId)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((result) =>{
        this.productDetails = result;
      })
  }

  onAddToFavorites(){
    var addProductToFavoritesOrCart = new AddProductToFavoritesOrCart();
    addProductToFavoritesOrCart.productId = this.productDetails.id;
    addProductToFavoritesOrCart.userId = this.userId;

    this.productService.addProductToFavorites(addProductToFavoritesOrCart)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe();
  }

  onAddToCart(){
    var addProductToFavoritesOrCart = new AddProductToFavoritesOrCart();
    addProductToFavoritesOrCart.productId = this.productDetails.id;
    addProductToFavoritesOrCart.userId = this.userId;

    this.productService.addProductToCart(addProductToFavoritesOrCart)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe();
  }

}
