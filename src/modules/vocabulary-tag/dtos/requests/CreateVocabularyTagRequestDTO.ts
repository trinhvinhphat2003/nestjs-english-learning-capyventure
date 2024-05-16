import { IsNotEmpty, IsString } from "class-validator";

export class CreateVocabularyTagRequestDTO {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsNotEmpty()
    picture: string
}