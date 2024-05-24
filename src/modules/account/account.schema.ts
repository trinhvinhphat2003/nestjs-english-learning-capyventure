import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AccountDocument = HydratedDocument<Account>;

export enum Role {
    admin = 'admin',
    member = 'member',
    premium_member = 'premium_member',
}

export type Subscription = {
    type: string,
    startDate: number,
    endDate: number
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

    @Prop({ required: false, defaultValue: false })
    isPremium: boolean

    @Prop({type: Object, required: false, defaultValue: {
        type: "none",
        startDate: 0,
        endDate: 0
    } as Subscription })
    currScription: Subscription
}

export const AccountSchema = SchemaFactory.createForClass(Account);