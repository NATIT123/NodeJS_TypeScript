import { ProductCondDTO, ProductUpdateDTO } from "@modules/product/model/dto";
import { Product, ProductSchema } from "@modules/product/model/product";
import {
  BaseCommandRepositorySequelize,
  BaseQueryRepositorySequelize,
  BaseRepositorySequelize,
} from "@share/repository/repo-sequelize";
import { Sequelize } from "sequelize";

export class MySQLProductRepository extends BaseRepositorySequelize<
  Product,
  ProductCondDTO,
  ProductUpdateDTO
> {
  constructor(readonly sequelize: Sequelize, readonly modelName: string) {
    super(
      new MYSQLProductQueryRepository(sequelize, modelName),
      new MYSQLProductCommandRepository(sequelize, modelName),
      ProductSchema
    );
  }
}

export class MYSQLProductQueryRepository extends BaseQueryRepositorySequelize<
  Product,
  ProductCondDTO
> {
  constructor(readonly sequelize: Sequelize, readonly modelName: string) {
    super(sequelize, modelName);
  }

  // async get(id: string): Promise<Product | null> {
  //   const data = await this.sequelize.models[this.modelName].findByPk(id, {
  //      include: [
  //       {model: this.sequelize.models['ProductCategory'], as: 'category'},
  //       {model: this.sequelize.models['ProductBrand'], as: 'brand'},
  //     ],
  //   });

  //   if (!data) {
  //     return null;
  //   }

  //   const persistenceData = data.get({ plain: true });
  //   const { created_at, updated_at, ...props } = persistenceData;

  //   return {
  //     ...props,
  //     createdAt: persistenceData.created_at,
  //     updatedAt: persistenceData.updated_at,
  //   } as Product;
  // }
}

export class MYSQLProductCommandRepository extends BaseCommandRepositorySequelize<
  Product,
  ProductUpdateDTO
> {
  constructor(readonly sequelize: Sequelize, readonly modelName: string) {
    super(sequelize, modelName);
  }
}
