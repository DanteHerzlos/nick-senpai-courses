import { IsEmail, IsNotEmpty } from 'class-validator';

export class AcceptResetPasswordDto {
    @IsNotEmpty()
    password: string;
}