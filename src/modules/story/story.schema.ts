import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type StoryDocument = HydratedDocument<Story>;

export interface Comment {
    account_id: string,
    message: string
}

export interface Content {
    chapter: string,
    content: string
}

@Schema()
export class Story {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    author: string;

    @Prop({ required: true, default: 0 })
    views: number;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    display_image: string;

    @Prop({ required: true })
    contents: Content[];

    @Prop({ required: true })
    category: string;

    @Prop({ required: true, default: [] })
    comment: Comment[];
}

export const StorySchema = SchemaFactory.createForClass(Story);