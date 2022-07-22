import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { User } from "src/user/user.schema";

export type TokenDocument = Token & Document

@Schema({timestamps: true, expireAfterSeconds: 2592000})
export class Token {
    @Prop({
        type: mongoose.Schema.Types.ObjectId, ref: 'User', 
        required: true
    })
    user: User

    @Prop({required: true})
    refreshToken: string
}

export const TokenSchema = SchemaFactory.createForClass(Token);