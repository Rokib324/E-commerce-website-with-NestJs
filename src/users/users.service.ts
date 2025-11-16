import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserSignUpDto } from './dto/user-signup.dto';
import * as bcrypt from 'bcrypt';
import { hash } from 'bcrypt';

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
}
