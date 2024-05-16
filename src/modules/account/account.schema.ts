import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AccountDocument = HydratedDocument<Account>;

export enum Role {
    admin = 'admin',
    member = 'member',
    premium_member = 'premium_member',
}

@Schema()
export class Account {
    @Prop({ required: true })
    email: string;

    @Prop({ required: false, default: "Anonymous User" })
    name: string;

    @Prop({ required: false, defaultValue: "" })
    picture: string;

    @Prop({ type: String, enum: Role, default: Role.member })
    role: Role;
}

export const AccountSchema = SchemaFactory.createForClass(Account);