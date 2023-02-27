import { Guid } from "guid-typescript";

export class AddProductToFavoritesOrCart{
    userId!: Guid;
    productId!: Guid;
}