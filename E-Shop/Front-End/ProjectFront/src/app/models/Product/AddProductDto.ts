import { ProductTypes } from "src/app/enums/ProductType";

export class AddProductDto{
    name!: string;
    price!: number;
    discount!: number;
    stock!: number;
    file!: FormData;
    productType!: ProductTypes;
}