import { IsEmail, IsNotEmpty } from "class-validator";
import { Role } from "../../account.schema";

export class CreateAccountRequestDTO {

    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    role: Role;

    vocab_storage_tags: string[];
}