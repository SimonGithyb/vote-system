import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema()
export class CreateVote extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    type: string;

    @Prop({ required: true })
    forFuture: boolean;

    @Prop({ required: true })
    answers: []

    @Prop({ required: true })
    ownerId: mongoose.Types.ObjectId;

    @Prop({ defalut:'Normal life' })
    category: string;
}

export const CreateVoteSchema = SchemaFactory.createForClass(CreateVote);
