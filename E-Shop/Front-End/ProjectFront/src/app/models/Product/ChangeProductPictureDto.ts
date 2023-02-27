import { Guid } from "guid-typescript";

export class ChangeProductPictureDto{
    productId!: Guid;
    file!: FormData;
}