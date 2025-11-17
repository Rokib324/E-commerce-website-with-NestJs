import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserSignUpDto } from './dto/user-signup.dto';
import { UserEntity } from './entities/user.entity';
import { UserSignInDto } from './dto/user-signin.dto';
import { CurrentUser } from './utility/decorstors/current-user.decorator';
import { AuthenticationGuard } from './utility/guards/authentication.guard';
import { AuthorizeRoles } from './utility/decorstors/authorize-roles.decorators';
import { UserRoles } from './utility/common/user-roles.enum';
import { AuthorizeGuard } from './utility/guards/authorization.guards';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}


  @Post('signup')
  async signup(@Body() userSignUpDto: UserSignUpDto): Promise<{user:UserEntity}> {
    return {user: await this.usersService.signup(userSignUpDto)};
  }

  @Post('signin')
  async signin(@Body() UserSignInDto:UserSignInDto): Promise<{
    accessToken: string;
    user: UserEntity; }> {
    const user = await this.usersService.signin(UserSignInDto);
    const accessToken = await this.usersService.accessToken(user);
    return {accessToken, user};
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    // return this.usersService.create(createUserDto);
    return "User created successfully";
  }


  @AuthorizeRoles(UserRoles.ADMIN)
  @UseGuards(AuthenticationGuard, AuthorizeGuard)
  @Get('all')
  async findAll(): Promise<UserEntity[]> {
    return await this.usersService.findAll();
  }

  @Get('single/:id')
  async findOne(@Param('id') id: string): Promise<UserEntity> {
    const user = await this.usersService.findOne(+id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @UseGuards(AuthenticationGuard)
  @Get('me')
  getCurrentUser(@CurrentUser() currentUser: UserEntity) {
    return currentUser ? currentUser : null;
  }
}
