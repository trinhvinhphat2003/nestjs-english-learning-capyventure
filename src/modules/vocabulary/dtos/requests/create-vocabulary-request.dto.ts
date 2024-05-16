import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class CreateVocabularyRequestDTO {
    @IsString()
    @IsNotEmpty()
    sourceText: string;

    @IsString()
    @IsNotEmpty()
    translation: string;

    @IsString()
    @IsNotEmpty()
    collection: string;
}