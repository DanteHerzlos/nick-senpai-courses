import { IsNotEmpty } from 'class-validator';

export class TokenPayloadDto {
    @IsNotEmpty()
    userId: string;

    @IsNotEmpty()
    role: string;

    @IsNotEmpty()
    userAgent: string;

    @IsNotEmpty()
    ipAddress: string;
}