import { ProductTypes } from "src/app/enums/ProductType";

export class GetProductsByTypeDto{
    page!: number;
    productType!: ProductTypes;
}