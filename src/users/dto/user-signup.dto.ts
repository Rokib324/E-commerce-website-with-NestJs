import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import { UserRoles } from "../utility/common/user-roles.enum";

export class UserSignUpDto {
    @IsNotEmpty({message: 'Name is required'})
    @IsString({message: 'Name must be a string'})
    name: string;

    @IsNotEmpty({message: 'Email is required'})
    @IsEmail({}, {message: 'Email must be a valid email'})
    email: string;

    @IsNotEmpty({message: 'Password is required'})
    @MinLength(6, {message: 'Password must be at least 6 characters long'})
    
    password: string;

    
    roles: UserRoles[];
}