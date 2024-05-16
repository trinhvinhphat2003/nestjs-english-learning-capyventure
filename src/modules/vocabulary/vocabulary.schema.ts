import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type VocabularyDocument = HydratedDocument<Vocabulary>;

@Schema()
export class Vocabulary {
    @Prop({ required: true })
    sourceText: string;

    @Prop({ required: true })
    translation: string;

    @Prop({ required: true })
    collection: string;

    @Prop({required: true})
    accountId: string
}

export const VocabularySchema = SchemaFactory.createForClass(Vocabulary);