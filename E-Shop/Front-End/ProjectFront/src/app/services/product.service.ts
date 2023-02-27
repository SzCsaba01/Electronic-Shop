import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProductTypes } from '../enums/ProductType';
import { AddProductToFavoritesOrCart } from '../models/Product/AddProductToFavoritesOrCart';
import { EditProductDto } from '../models/Product/EditProductDto';
import { GetOrderedProductsDto } from '../models/Product/GetOrderedProductsDto';
import { GetProductDto } from '../models/Product/GetProductDto';
import { GetProductsByTypeDto } from '../models/Product/GetProductsByTypeDto';
import { ProductPaginationDto } from '../models/Product/ProductPaginationDto';
import { ProductSearchDto } from '../models/Product/ProductSearchDto';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private _url = 'Product'
  constructor(private http: HttpClient) { }

  public getProducts() : Observable<ProductTypes[]>{
    return this.http.get<ProductTypes[]>(`${environment.apiUrl}/${this._url}/ProductTypes`);
  }

  public addProduct(addProductDto: FormData){
    console.log(addProductDto);
    return this.http.post(`${environment.apiUrl}/${this._url}/AddProduct`, addProductDto);
  }

  public deleteProduct(id: Guid){
    return this.http.delete(`${environment.apiUrl}/${this._url}/DeleteProduct?id=${id}`);
  }

  public editProduct(editProduct: EditProductDto){
    return this.http.put(`${environment.apiUrl}/${this._url}/EditProduct`, editProduct);
  }

  public changeProductPicture(changeProductPicture: FormData){
    return this.http.put(`${environment.apiUrl}/${this._url}/ChangeProductPicture`, changeProductPicture);
  }

  public getSearchedProductsByName(productSearchDto: ProductSearchDto): Observable<ProductPaginationDto>{
    return this.http.post<ProductPaginationDto>(`${environment.apiUrl}/${this._url}/SearchProductsByName`, productSearchDto);
  }

  public getProductsPaginatedByType(getProductsByTypeDto: GetProductsByTypeDto):Observable<ProductPaginationDto>{
    return this.http.post<ProductPaginationDto>(`${environment.apiUrl}/${this._url}/PaginatedProducts`, getProductsByTypeDto);
  }

  public addProductToFavorites(addProductToFavorites: AddProductToFavoritesOrCart){
    return this.http.post(`${environment.apiUrl}/${this._url}/AddProductToFavorites`, addProductToFavorites);
  }

  public addProductToCart(addProductToCart: AddProductToFavoritesOrCart){
    return this.http.post(`${environment.apiUrl}/${this._url}/AddProductToCart`, addProductToCart);
  }

  public deleteProductFromCart(deleteProductFromCart: AddProductToFavoritesOrCart){
    return this.http.post(`${environment.apiUrl}/${this._url}/RemoveProductFromCart`, deleteProductFromCart);
  }

  public getFavoriteProducts(id: Guid): Observable<GetProductDto[]>{
    return this.http.post<GetProductDto[]>(`${environment.apiUrl}/${this._url}/GetFavoriteProducts?id=${id}`, id);
  }

  public getCartProducts(id: Guid): Observable<GetProductDto[]>{
    return this.http.post<GetProductDto[]>(`${environment.apiUrl}/${this._url}/GetCartProducts?id=${id}`, id);
  }
  
  public getOrderedProducts(id: Guid): Observable<GetOrderedProductsDto[]>{
    return this.http.post<GetOrderedProductsDto[]>(`${environment.apiUrl}/${this._url}/GetOrderedProducts?id=${id}`, id);
  }

  public addNewOrder(id: Guid){
    return this.http.put(`${environment.apiUrl}/${this._url}/AddNewOrder?id=${id}`, id);
  }

  public getProductById(id: Guid): Observable<GetProductDto>{
    return this.http.get<GetProductDto>(`${environment.apiUrl}/${this._url}/GetProductById?id=${id}`);
  }

}
