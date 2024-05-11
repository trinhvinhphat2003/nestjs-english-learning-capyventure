import { IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator";

export interface Transcript {
    sentence: string,
    timestamp: number,
    translation: string
}

export class CreateVideoRequestDTO {
    @IsString()
    @IsNotEmpty()
    videoLink: string;

    @IsString()
    @IsNotEmpty()
    channel: string;

    @IsString()
    @IsNotEmpty()
    thumbnail: string;

    @IsString()
    @IsNotEmpty()
    category: string;

    @IsString()
    @IsNotEmpty()
    level: string;

    @IsString()
    @IsNotEmpty()
    caption: string;

    @IsString()
    @IsNotEmpty()
    fullText: string;

    @IsNumber()
    duration: number;

    @IsArray()
    transcripts: Transcript[];
}