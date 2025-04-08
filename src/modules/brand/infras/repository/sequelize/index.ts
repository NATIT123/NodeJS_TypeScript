import {
  BaseCommandRepositorySequelize,
  BaseQueryRepositorySequelize,
  BaseRepositorySequelize,
} from "../../../../../share/repository/repo-sequelize";
import { BrandCondDTO, BrandUpdateDto } from "../../../model/dto";
import { Brand, BrandSchema } from "../../../model/model";
import { modelName } from "./dto";
import { Sequelize } from "sequelize";

export class MySQLBrandRepository extends BaseRepositorySequelize<
  Brand,
  BrandCondDTO,
  BrandUpdateDto
> {
  constructor(sequelize: Sequelize) {
    super(
      new MySQLQueryRepository(sequelize, modelName),
      new MySQLCommandRepository(sequelize, modelName),
      BrandSchema
    );
  }
}

export class MySQLQueryRepository extends BaseQueryRepositorySequelize<
  Brand,
  BrandCondDTO
> {}
export class MySQLCommandRepository extends BaseCommandRepositorySequelize<
  Brand,
  BrandUpdateDto
> {}
