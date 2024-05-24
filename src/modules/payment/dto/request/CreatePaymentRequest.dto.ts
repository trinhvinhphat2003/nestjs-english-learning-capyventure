import { IsEmail, IsNotEmpty } from "class-validator";

export class CreatePaymentRequestDTO {
    @IsNotEmpty()
    subcriptionType: string;
}