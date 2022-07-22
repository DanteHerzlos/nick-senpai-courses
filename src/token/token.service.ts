import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { sign, verify } from "jsonwebtoken";
import { Model } from "mongoose";
import { TokenPayloadDto } from "./dto/payload-token.dto";
import { Token, TokenDocument } from "./token.schema";


@Injectable()
export class TokenService{
    constructor(
        @InjectModel(Token.name) private TokenModel: Model<TokenDocument>,
    ) {}

    generateToken(payload: TokenPayloadDto) {
        const accessToken = sign( 
            payload, 
            process.env.ACCESS_SECRET, 
            {expiresIn: '15m'}
        )
        const refreshToken = sign(
            payload,
            process.env.REFRESH_SECRET, 
            {expiresIn: '30d'}
        )
        return {
            accessToken,
            refreshToken
        }
    }

    validateAccessToken(accessToken: string) {
        try {
            const UserData = verify(accessToken, process.env.ACCESS_SECRET) as TokenPayloadDto
            return UserData
        } catch (e) { return null }
    }

    validateRefreshToken(refreshToken: string) {
        try {
            const UserData = verify(refreshToken, process.env.REFRESH_SECRET)
            return UserData
        } catch (e) { return null }
    }

    async saveToken(userId: string, refreshToken: string) {
        const tokenData = await this.TokenModel.find({user: userId}).sort('updatedAt')
        if(tokenData.length >= 10){
            tokenData[0].refreshToken = refreshToken
            return tokenData[0].save()
        }
        
        const token = await this.TokenModel.create({user: userId, refreshToken})

        return token
    }

    async updateToken(oldRefreshToken: string, newRefreshToken: string) {
        const tokenData = await this.TokenModel.findOne({refreshToken: oldRefreshToken})
        
        if (tokenData) {
            tokenData.refreshToken = newRefreshToken
            return tokenData.save()
        }else{
            throw new UnauthorizedException()
        }
    }

    async removeToken(refreshToken: string) {
        const tokenData = await this.TokenModel.deleteOne({refreshToken})
        return tokenData
    }

    async findToken(refreshToken: string) {
        const tokenData = await this.TokenModel.findOne({refreshToken})
        return tokenData
    }

}