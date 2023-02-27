import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProductTypes } from 'src/app/enums/ProductType';
import { RoleType } from 'src/app/enums/RoleType';
import { GetProductDto } from 'src/app/models/Product/GetProductDto';
import { ProductService } from 'src/app/services/product.service';
import { SelfUnsubscriberBase } from 'src/app/utils/SelfUnsubscriberBase';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent extends SelfUnsubscriberBase implements OnInit{

  ProductTypes = ProductTypes;

  userRole : string = localStorage.getItem('role') as unknown as string;
  expectedRole : string = RoleType.Admin as unknown as string;
  
  @Input() product!: GetProductDto;
  @Output() addedToCart = new EventEmitter<GetProductDto>();
  @Output() removedProduct = new EventEmitter<GetProductDto>();
  @Output() addedToFavorites = new EventEmitter<GetProductDto>();
  @Output() editingProduct = new EventEmitter<GetProductDto>();
  @Output() viewProductDetails = new EventEmitter<GetProductDto>();

  constructor(
    private productService: ProductService
  ){
    super();
  }

  ngOnInit(): void {
    
  }

  onAddToCart(){
    this.addedToCart.emit(this.product);
  }

  onDelete(){
    this.removedProduct.emit(this.product);
  }

  onAddToFavorite(){
    this.addedToFavorites.emit(this.product);
  }

  onEditProduct(){
    this.editingProduct.emit(this.product);
  }

  onViewProductDetails(){
    this.viewProductDetails.emit(this.product);
  }

}
