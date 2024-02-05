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

    @IsNumber()
    @IsNotEmpty()
    views: number;

    comment: Comment[];

    @IsString()
    @IsNotEmpty()
    level: string;
}