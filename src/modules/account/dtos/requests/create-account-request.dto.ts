import { IsEmail, IsNotEmpty } from "class-validator";
import { Role } from "../../account.schema";

export class CreateAccountRequestDTO {

    @IsEmail()
    email: string;

    @IsNotEmpty()
    role: Role;

    name: string;

    picture: string;
}