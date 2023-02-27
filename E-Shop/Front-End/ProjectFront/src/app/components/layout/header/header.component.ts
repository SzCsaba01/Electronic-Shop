import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Route, Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { takeUntil } from 'rxjs';
import { ProductTypes } from 'src/app/enums/ProductType';
import { RoleType } from 'src/app/enums/RoleType';
import { AddProductToFavoritesOrCart } from 'src/app/models/Product/AddProductToFavoritesOrCart';
import { GetOrderedProductsDto } from 'src/app/models/Product/GetOrderedProductsDto';
import { GetProductDto } from 'src/app/models/Product/GetProductDto';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ProductService } from 'src/app/services/product.service';
import { UserService } from 'src/app/services/user.service';
import { SelfUnsubscriberBase } from 'src/app/utils/SelfUnsubscriberBase';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent extends SelfUnsubscriberBase implements OnInit {

  loginStatus : boolean = false;

  productTypes!: ProductTypes[];

  ProductTypes = ProductTypes;

  roleType = RoleType;

  isShownLogoutModal: boolean  = false;

  cartProducts?: GetProductDto[];
  favoriteProducts?: GetProductDto[];

  userId : Guid = localStorage.getItem('id') as unknown as Guid;

  userRole : string = localStorage.getItem('role') as unknown as string;
  expectedRole : string = RoleType.Admin as unknown as string;

  @Input() profilePicture?: string;
  @Output() searchEvent = new EventEmitter<string>();
  searchedProductsByName: string = "";

  constructor(
    private productService : ProductService,
    private authenticationService : AuthenticationService,
    private userService : UserService,
    private route: Router,
    ) {
    super();
  }

  ngOnInit(): void {
    this.route.routeReuseStrategy.shouldReuseRoute = () => false;
    this.productService.getProducts()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((result) => {
        this.productTypes = result;
      })
    this.loginStatus = this.authenticationService.isAuthenticated();
    if(!this.loginStatus){
      return;
    }

    this.userService.getUserProfilePictureUrl(this.userId)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((result) => {
        this.profilePicture = result;
      })
    
    this.productService.getCartProducts(this.userId)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((result) => {
        this.cartProducts = result;
      })

    this.productService.getFavoriteProducts(this.userId)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((result) => {
      this.favoriteProducts = result;
    })

  }

  changeShowLogoutModal(){
    this.isShownLogoutModal = !this.isShownLogoutModal;
  }

  onLogout(){
    this.authenticationService.logout();
    this.loginStatus != this.loginStatus; 
    this.isShownLogoutModal = !this.isShownLogoutModal
    this.route.navigate(['login']);
  }

  onSearchProductName(){
    this.searchEvent.emit(this.searchedProductsByName);

  }

  deleteProductFromFavorites(id: Guid){
    var addProductToFavoritesOrCart = new AddProductToFavoritesOrCart();
    addProductToFavoritesOrCart.productId = id;
    addProductToFavoritesOrCart.userId = this.userId;

    this.productService.addProductToFavorites(addProductToFavoritesOrCart)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.productService.getFavoriteProducts(this.userId)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((result) => {
          this.favoriteProducts = result;
        })
      });
  }

  deleteProductFromCart(id: Guid){
    var addProductToFavoritesOrCart = new AddProductToFavoritesOrCart();
    addProductToFavoritesOrCart.productId = id;
    addProductToFavoritesOrCart.userId = this.userId;

    this.productService.deleteProductFromCart(addProductToFavoritesOrCart)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.productService.getCartProducts(this.userId)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((result) => {
          this.cartProducts = result;
        })
      });
  }

  onViewProductDetails(id: Guid){
    this.route.navigate(['/product-detail/',id]);
  }

}
