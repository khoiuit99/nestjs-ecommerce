import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class UserSignIn {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail({}, { message: 'should be email' })
  email: string;

  @ApiProperty()
  @MinLength(5)
  @IsNotEmpty()
  password: string;
}
