import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type StoryCategoryDocument = HydratedDocument<StoryCategory>;

@Schema()
export class StoryCategory {
    @Prop({ required: true })
    category_name: string;
}

export const StoryCategorySchema = SchemaFactory.createForClass(StoryCategory);