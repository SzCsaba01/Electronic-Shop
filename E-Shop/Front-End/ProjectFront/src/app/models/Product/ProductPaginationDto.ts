import { GetProductDto } from "./GetProductDto";

export class ProductPaginationDto{
    products!: GetProductDto[];
    numberOfProducts!: number;
    numberOfPages!: number;
}