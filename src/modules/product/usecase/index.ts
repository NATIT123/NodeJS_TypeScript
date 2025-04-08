import { IRepository } from "@share/interface";
import { ErrDataNotFound } from "@share/model/base-error";
import { ModelStatus } from "@share/model/base-model";
import { PagingDTO } from "@share/model/paging";
import { v7 } from "uuid";
import { IBrandQueryRepository, ICategoryQueryRepository, IProductUseCase } from "../interface";
import { ProductCondDTO, ProductCondSchema, ProductCreateDTO, ProductCreateSchema, ProductUpdateDTO, ProductUpdateSchema } from "../model/dto";
import { ErrBrandNotFound, ErrCategoryNotFound } from "../model/error";
import { Product, ProductGender } from "../model/product";

export class ProductUseCase implements IProductUseCase {
  constructor(
    private readonly repository: IRepository<Product, ProductCondDTO, ProductUpdateDTO>,
    private readonly productBrandRepository: IBrandQueryRepository,
    private readonly productCategoryRepository: ICategoryQueryRepository
  ) { }

  async create(data: ProductCreateDTO): Promise<string> {
    const dto = ProductCreateSchema.parse(data);

    if (dto.brandId) {
      const brand = await this.productBrandRepository.get(dto.brandId);
      if (!brand) {
        throw ErrBrandNotFound;
      }
    }

    if (dto.categoryId) {
      const category = await this.productCategoryRepository.get(dto.categoryId);
      if (!category) {
        throw ErrCategoryNotFound;
      }
    }

    const newId = v7();
    const newProduct: Product = {
      ...dto,
      id: newId,
      status: ModelStatus.ACTIVE,
      rating: 0,
      saleCount: 0,
      gender: ProductGender.UNISEX,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.repository.insert(newProduct);

    return newId;
  }

  async getDetail(id: string): Promise<Product | null> {
    const data = await this.repository.get(id);

    if (!data || data.status === ModelStatus.DELETED) {
      throw ErrDataNotFound;
    }

    return data;
  }

  async update(id: string, data: ProductUpdateDTO): Promise<boolean> {
    const dto = ProductUpdateSchema.parse(data);

    const product = await this.repository.get(id);
    if (!product || product.status === ModelStatus.DELETED) {
      throw ErrDataNotFound;
    }

    await this.repository.update(id, dto);

    return true;
  }

  async list(cond: ProductCondDTO, paging: PagingDTO): Promise<Product[]> {
    const parsedCond = ProductCondSchema.parse(cond);

    return await this.repository.list(parsedCond, paging);
  }

  async delete(id: string): Promise<boolean> {
    const product = await this.repository.get(id);

    if (!product || product.status === ModelStatus.DELETED) {
      throw ErrDataNotFound;
    }

    await this.repository.delete(id, false);

    return true;
  }
}