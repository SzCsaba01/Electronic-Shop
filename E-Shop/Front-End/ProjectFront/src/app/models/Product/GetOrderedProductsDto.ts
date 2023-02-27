import { Time } from "@angular/common";
import { GetProductDto } from "./GetProductDto";

export class GetOrderedProductsDto{
    totalPrice!: number;
    time!: Time;
    products!: GetProductDto[];
}