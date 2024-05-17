import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserSignUp } from './dto/user-signup.dto';
import { compare, hash } from 'bcrypt';
import { UserSignIn } from './dto/user-signin.dto';
import { sign } from 'jsonwebtoken';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async asyncSignup(userSignUp: UserSignUp) {
    const userExists = await this.findUserByEmail(userSignUp.email);
    if (userExists !== null) {
      throw new BadRequestException('user existed');
    }
    userSignUp.password = await hash(userSignUp.password, 10);
    let user = this.userRepository.create(userSignUp);
    user = await this.userRepository.save(user);
    delete user.password;

    return user;
  }

  async asyncSignIn(userSignIn: UserSignIn) {
    const userExists = await this.userRepository
      .createQueryBuilder('users')
      .addSelect('users.password')
      .where('users.email=:email', { email: userSignIn.email })
      .getOne();
    if (userExists == null) {
      throw new BadRequestException('user not found');
    }
    const matchPassword = await compare(
      userSignIn.password,
      userExists.password,
    );
    if (!matchPassword) {
      throw new BadRequestException('wrong password');
    }
    delete userExists.password;
    return userExists;
  }

  async findAll() {
    return await this.userRepository.createQueryBuilder('users').getMany();
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOneBy({ id: id });
    if (!user) {
      throw new BadRequestException('user not found');
    }

    return user;
  }

  async findUserByEmail(email: string) {
    return await this.userRepository.findOneBy({ email: email });
  }

  async accessToken(user: UserEntity) {
    return sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.ACCESS_TOKEN_SECRET_KEY,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRE },
    );
  }
}
