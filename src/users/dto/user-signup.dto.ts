import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { UserSignIn } from './user-signin.dto';

export class UserSignUp extends UserSignIn {
  @ApiProperty()
  @IsString({ message: 'should be text' })
  name: string;
}
