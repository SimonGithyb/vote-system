import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema()
export class Vote extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    type: string;

    @Prop({ required: true })
    questions: [{
        name: string,
        answers: []
    }];

    @Prop({ required: true })
    userId: mongoose.Types.ObjectId;

    @Prop({ required: true })
    expiryDate: number;
}

export const VoteSchema = SchemaFactory.createForClass(Vote);
