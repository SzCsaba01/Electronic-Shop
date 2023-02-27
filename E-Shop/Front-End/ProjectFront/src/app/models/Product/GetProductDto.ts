import { Guid } from "guid-typescript";
import { ProductTypes } from "src/app/enums/ProductType";

export class GetProductDto{
    id!: Guid;
    name!: string;
    price!: number;
    discount!: number;
    stock!: number;
    picture!: string;
    productType?: ProductTypes
}