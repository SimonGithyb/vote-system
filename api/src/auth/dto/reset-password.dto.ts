import { IsString, MinLength, Matches } from "class-validator";

export class ResetPasswordDto {
      @IsString()
        @MinLength(8)
        @Matches(/^(?=.*[0-9])/, { message: 'Password must contain at least one number'} )
    newPassword: string;

    @IsString()
    resetToken: string;
}
