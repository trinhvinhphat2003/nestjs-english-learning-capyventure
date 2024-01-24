import { IsArray, IsNotEmpty, IsString } from "class-validator";
import { Content } from "../../story.schema";

export class CreateStoryRequestDTO {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    author: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsArray()
    contents: Content[];

    @IsString()
    @IsNotEmpty()
    category: string;
}