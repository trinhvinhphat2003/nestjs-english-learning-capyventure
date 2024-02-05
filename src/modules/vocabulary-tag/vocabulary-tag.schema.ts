import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type VocabularyTagDocument = HydratedDocument<VocabularyTag>;

@Schema()
export class VocabularyTag {
    @Prop({ required: true })
    name: string;

    @Prop({required: true})
    accountId: string
}

export const VocabularyTagSchema = SchemaFactory.createForClass(VocabularyTag);