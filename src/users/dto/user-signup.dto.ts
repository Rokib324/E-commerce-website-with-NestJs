import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import { UserRoles } from "../utility/common/user-roles.enum";
import { UserSignInDto } from "./user-signin.dto";

export class UserSignUpDto extends UserSignInDto {
    @IsNotEmpty({message: 'Name is required'})
    @IsString({message: 'Name must be a string'})
    name: string;
}