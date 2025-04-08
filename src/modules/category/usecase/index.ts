import { ICategoryUseCase, IReposiotry } from "../interface";
import {
  CategoryCondDTO,
  CategoryCreateDto,
  CategoryCreateSchema,
  CategoryUpdateDto,
} from "../model/dto";
import { Category } from "../model/model";
import { ModelStatus } from "../../../share/model/base-model";
import { v7 } from "uuid";
import { PagingDTO } from "../../../share/model/paging";
import { ErrDataNotFound } from "../../../share/model/base-error";
import { ZodError } from "zod";
import { ErrCategoryNameTooShort } from "../model/errors";

export class CategoryUseCase implements ICategoryUseCase {
  constructor(private readonly repository: IReposiotry) {}
  async getListCategories(
    cond: CategoryCondDTO,
    paging: PagingDTO
  ): Promise<Category[]> {
    const data = await this.repository.list(cond, paging);
    return data;
  }
  async getDetailCategory(id: string): Promise<Category | null> {
    const category = await this.repository.get(id);
    if (!category || category.status == ModelStatus.DELETED) {
      throw ErrDataNotFound;
    }
    return category;
  }
  async updateCategory(id: string, data: CategoryUpdateDto): Promise<boolean> {
    const category = await this.repository.get(id);
    if (!category || category.status == ModelStatus.DELETED) {
      throw ErrDataNotFound;
    }
    return await this.repository.update(id, data);
  }
  async deleteCategory(id: string): Promise<boolean> {
    const category = await this.repository.get(id);
    if (!category || category.status == ModelStatus.DELETED) {
      throw ErrDataNotFound;
    }
    return await this.repository.delete(id, true);
  }

  async createNewCategory(data: CategoryCreateDto): Promise<string> {
    const {
      success,
      data: paresedData,
      error,
    } = CategoryCreateSchema.safeParse(data);

    if (error) {
      const issues = (error as ZodError).issues;

      for (const issue of issues) {
        if (issue.path[0] === "name") {
          throw ErrCategoryNameTooShort;
        }
      }
    }

    const newId = v7();
    const category: Category = {
      id: newId,
      name: paresedData!.name,
      position: 0,
      image: paresedData!.image,
      description: paresedData!.description,
      status: ModelStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.repository.insert(category);

    return newId;
  }
}
