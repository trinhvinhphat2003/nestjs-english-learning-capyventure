import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateStoryCategoryRequestDTO {
    @IsNotEmpty()
    category_name: string;
}