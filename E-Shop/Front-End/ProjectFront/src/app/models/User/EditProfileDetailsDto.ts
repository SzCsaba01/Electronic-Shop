import { Guid } from "guid-typescript";

export class EditProfileDetails{
    userId!: Guid;
    username!: string;
    firstName!: string;
    lastName!: string;
    email!: string;
    city!: string;
    country!: string;
    state!: string;
    address!: string;
    phoneNumber!: string;
}