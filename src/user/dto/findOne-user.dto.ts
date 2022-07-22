import { IsNotEmpty } from 'class-validator';

export class FindOneUserDto {
    @IsNotEmpty()
    readonly username: string
}