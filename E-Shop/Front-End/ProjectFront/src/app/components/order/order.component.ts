import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { takeUntil } from 'rxjs';
import { ProductTypes } from 'src/app/enums/ProductType';
import { GetProductDto } from 'src/app/models/Product/GetProductDto';
import { ProductService } from 'src/app/services/product.service';
import { SelfUnsubscriberBase } from 'src/app/utils/SelfUnsubscriberBase';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent  extends SelfUnsubscriberBase implements OnInit {

  private userId = this.activeRoute.snapshot.paramMap.get("userId") as unknown as Guid;


  ProductType = ProductTypes;

  totalPrice: number = 0;

  cartProducts : GetProductDto[] = [];

  emptyCart : boolean = true;

  constructor(
    private route: Router,
    private productService: ProductService,
    private activeRoute: ActivatedRoute,
  ){
    super();
  }

  ngOnInit(){
    this.productService.getCartProducts(this.userId)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((result) => {
        this.cartProducts = result;
        this.cartProducts.forEach((product) => {
          this.totalPrice += product.price;
        })

        if(this.cartProducts.length > 0){
          this.emptyCart = false;
        }
      })
  }

  onViewProductDetails(id: Guid){
    this.route.navigate(['/product-detail',id]);
  }


  onAddOrder(){
    this.productService.addNewOrder(this.userId)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.cartProducts = [];
        this.emptyCart = true;
      });
  }
}
