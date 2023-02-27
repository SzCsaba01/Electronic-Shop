import { Guid } from "guid-typescript";
import { ProductTypes } from "src/app/enums/ProductType";

export class EditProductDto{
    productId!: Guid;
    name!: string;
    price!: number;
    discount!: number;
    stock!: number;
    productType!: ProductTypes;
}