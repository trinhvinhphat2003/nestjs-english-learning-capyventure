import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class CreateVocabularyRequestDTO {
    @IsString()
    @IsNotEmpty()
    word: string;

    @IsString()
    @IsNotEmpty()
    definition: string;

    @IsString()
    @IsNotEmpty()
    tag: string;
}