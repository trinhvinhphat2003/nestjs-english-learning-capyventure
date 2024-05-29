import { IsArray, IsNotEmpty, IsNumber, IsString, isArray } from "class-validator";
import { Comment, Content } from "../../story.schema";

export class UpdateStoryRequestDTO {
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

    @IsString()
    @IsNotEmpty()
    level: string;

    @IsString()
    @IsNotEmpty()
    display_image: string;

    isPremium: boolean
}