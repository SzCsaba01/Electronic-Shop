import { Guid } from "guid-typescript";

export class ChangeProfilePictureDto{
    userId!: Guid;
    profilePicture?: FormData;
    path?: string;
}