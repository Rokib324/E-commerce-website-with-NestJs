import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { DeleteResult, Repository } from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class CategoriesService {
  constructor (@InjectRepository(CategoryEntity) private readonly categoriesRepository: Repository<CategoryEntity>){}
  async create(createCategoryDto: CreateCategoryDto, currentUser: UserEntity): Promise<CategoryEntity> {
    const category = this.categoriesRepository.create(createCategoryDto);
    category.addedBy = currentUser;
    return await this.categoriesRepository.save(category)
  }

  async findAll(): Promise<CategoryEntity[]> {
    return await this.categoriesRepository.find();
  }

  async findOne(id: number): Promise<CategoryEntity | null> {
    return await this.categoriesRepository.findOneBy({id}) as CategoryEntity | null;
  }

  async update(id: number, fields: Partial<UpdateCategoryDto>): Promise<CategoryEntity | null> {
    const category = await this.findOne(id);
    if (!category) {
      return null;
    }
    Object.assign(category, fields);
    return await this.categoriesRepository.save(category);
  }


  async remove(id: number): Promise<DeleteResult> {
    return await this.categoriesRepository.delete(id) as DeleteResult;
  }
}
