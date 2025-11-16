import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserSignUpDto } from './dto/user-signup.dto';
import { UserSignInDto } from './dto/user-signin.dto';
import { compare, hash } from 'bcrypt'; 
import { sign, SignOptions } from 'jsonwebtoken';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async signup(userSignUpDto:UserSignUpDto): Promise<UserEntity> {
    const userExists = await this.finduserByEmail(userSignUpDto.email)
    if (userExists) {
      throw new BadRequestException('User already exists with this email');
    }

    userSignUpDto.password = await hash(userSignUpDto.password, 10);

    let user = this.usersRepository.create(userSignUpDto);
    user = await this.usersRepository.save(user);
    delete (user as any).password;
    return user;
  }
  
  async signin(UserSignInDto:UserSignInDto): Promise<UserEntity> {
    const userExists = await this.usersRepository.createQueryBuilder('users').addSelect('users.password').where('users.email=:email', {email:UserSignInDto.email}).getOne();

    if (!userExists)
      throw new UnauthorizedException('Invalid email or password');
    const matchPassword = await compare(UserSignInDto.password, userExists.password);
    if (!matchPassword)
      throw new UnauthorizedException('Invalid email or password');
    delete (userExists as any).password;
    return userExists;
  }


  create(createUserDto: CreateUserDto) {
    return this.usersRepository.save(createUserDto);
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async finduserByEmail(email:string) {
    return await this.usersRepository.findOneBy({email});
  }

  async accessToken(user:UserEntity): Promise<string> {
    const secret = process.env.ACCESS_TOKEN_SECRET_KEY;
    if (!secret) {
      throw new Error('ACCESS_TOKEN_SECRET_KEY is not defined');
    }
    const expiresIn = process.env.ACCESS_TOKEN_EXPIRATION_TIME || '1h';
    return sign({id:user.id, email:user.email}, secret, { expiresIn } as SignOptions);
  }
}
