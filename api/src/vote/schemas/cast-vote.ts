import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema()
export class CastVote extends Document {
    @Prop({ required: true, type: mongoose.Types.ObjectId })
    voteId: mongoose.Types.ObjectId;

    @Prop()
    userId: mongoose.Types.ObjectId;

    @Prop({ required: true })
    answers: [];

    @Prop({ required: true })
    date: string;

}

export const CastVoteSchema = SchemaFactory.createForClass(CastVote);
