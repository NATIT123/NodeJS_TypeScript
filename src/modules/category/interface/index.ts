import { createCategoryApi } from "./../infras/create-api";
import { PagingDTO } from "../../../share/model/paging";
import { Category } from "../model/model";
import {
  CategoryCondDTO,
  CategoryCreateDto,
  CategoryUpdateDto,
} from "../model/dto";
export interface ICategoryUseCase {
  createNewCategory(data: CategoryCreateDto): Promise<string>;
  getDetailCategory(id: string): Promise<Category | null>;
  getListCategories(
    cond: CategoryCondDTO,
    paging: PagingDTO
  ): Promise<Category[]>;
  updateCategory(id: string, data: CategoryUpdateDto): Promise<boolean>;
  deleteCategory(id: string): Promise<boolean>;
}

export interface IReposiotry extends ICommandRepository, IQueryRepository {}

export interface IQueryRepository {
  get(id: string): Promise<Category | null>;
  list(cond: CategoryCondDTO, paging: PagingDTO): Promise<Category[]>;
}

export interface ICommandRepository {
  insert(data: Category): Promise<boolean>;
  update(id: string, data: CategoryUpdateDto): Promise<boolean>;
  delete(id: string, isHard: boolean): Promise<boolean>;
}
