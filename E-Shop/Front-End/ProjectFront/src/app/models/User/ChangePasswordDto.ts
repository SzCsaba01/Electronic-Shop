import { Guid } from "guid-typescript";

export class ChangePasswordDto{
    id!: Guid;
    newPassword!: string;
    repeatNewPassword!: string;
}