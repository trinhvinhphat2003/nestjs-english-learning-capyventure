import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type VocabularyDocument = HydratedDocument<Vocabulary>;

@Schema()
export class Vocabulary {
    @Prop({ required: true })
    word: string;

    @Prop({ required: true })
    definition: string;

    @Prop({ required: true })
    tag: string;

    @Prop({required: true})
    accountId: string
}

export const VocabularySchema = SchemaFactory.createForClass(Vocabulary);