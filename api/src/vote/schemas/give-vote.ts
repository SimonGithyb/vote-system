import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema()
export class GiveVote extends Document {
    @Prop({ required: true, type: mongoose.Types.ObjectId })
    voteId: mongoose.Types.ObjectId;

    @Prop({ })
    votedUserId: mongoose.Types.ObjectId;

    @Prop({ required: true })
    answer: string;

}

export const GiveVoteSchema = SchemaFactory.createForClass(GiveVote);
