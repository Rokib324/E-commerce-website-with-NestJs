import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, NotFoundException } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CurrentUser } from 'src/users/utility/decorstors/current-user.decorator';
import { UserEntity } from 'src/users/entities/user.entity';
import { AuthenticationGuard } from 'src/users/utility/guards/authentication.guard';
import { AuthorizeGuard } from 'src/users/utility/guards/authorization.guards';
import { UserRoles } from 'src/users/utility/common/user-roles.enum';
import { CategoryEntity } from './entities/category.entity';
import { DeleteResult } from 'typeorm';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}
  @UseGuards(AuthenticationGuard, AuthorizeGuard([UserRoles.ADMIN]))
  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto, @CurrentUser() currentUser: UserEntity): Promise<CategoryEntity> {
    return this.categoriesService.create(createCategoryDto, currentUser);
  }

  @Get()
  async findAll(): Promise<CategoryEntity[]> {
    return await this.categoriesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<{category: CategoryEntity}> {
    const category = await this.categoriesService.findOne(+id);
    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
    return {category: category};
  }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([UserRoles.ADMIN]))
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto){
    return await this.categoriesService.update(+id, updateCategoryDto)
  }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([UserRoles.ADMIN]))
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<DeleteResult> {
    return await this.categoriesService.remove(+id);
  }
}
