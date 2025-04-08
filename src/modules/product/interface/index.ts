import { IUseCase } from "@share/interface";
import {
  ProductCondDTO,
  ProductCreateDTO,
  ProductUpdateDTO,
} from "../model/dto";
import { Product, ProductBrand, ProductCategory } from "../model/product";

export interface IProductUseCase
  extends IUseCase<
    ProductCreateDTO,
    ProductUpdateDTO,
    Product,
    ProductCondDTO
  > {
  // doSomething(): Promise<string>;
}

export interface IBrandQueryRepository {
  get(id: string): Promise<ProductBrand | null>;
}

export interface ICategoryQueryRepository {
  get(id: string): Promise<ProductCategory | null>;
}
