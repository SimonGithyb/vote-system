import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
    @Prop({ required: true })
    name: string;
    
    @Prop({ required: true })
    surname: string;


    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: false })
    password?: string;

    @Prop({ required: false })
    googleId?: string;

    @Prop({ default: "user" })
    role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
