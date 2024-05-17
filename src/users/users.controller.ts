import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import { UserSignUp } from './dto/user-signup.dto';
import { UserSignIn } from './dto/user-signin.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  async signup(@Body() user: UserSignUp) {
    return await this.usersService.asyncSignup(user);
  }

  @Post('signin')
  async signin(@Body() userSignIn: UserSignIn) {
    const user = await this.usersService.asyncSignIn(userSignIn);
    const accessToken = await this.usersService.accessToken(user);

    return { accessToken, user };
  }

  @Get()
  async findAll() {
    return await this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.usersService.findOne(id);
  }
}
