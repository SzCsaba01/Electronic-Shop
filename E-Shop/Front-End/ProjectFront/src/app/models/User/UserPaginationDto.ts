import { GetUserDto } from "./GetUserDto";

export class UserPaginationDto{
    getUserDto!: GetUserDto[];
    numberOfUsers!: number;
    numberOfPages!: number;
    
}