import {
  User,
  UserCondDTO,
  userSchema,
  UserUpdateDTO,
} from "@modules/user/model";
import {
  BaseCommandRepositorySequelize,
  BaseQueryRepositorySequelize,
  BaseRepositorySequelize,
} from "@share/repository/repo-sequelize";
import { Sequelize } from "sequelize";

export class MySQLUserRepository extends BaseRepositorySequelize<
  User,
  UserCondDTO,
  UserUpdateDTO
> {
  constructor(readonly sequelize: Sequelize, readonly modelName: string) {
    super(
      new MYSQLUserQueryRepository(sequelize, modelName),
      new MYSQLUserCommandRepository(sequelize, modelName),
      userSchema
    );
  }
}

export class MYSQLUserCommandRepository extends BaseCommandRepositorySequelize<
  User,
  UserUpdateDTO
> {
  constructor(readonly sequelize: Sequelize, readonly modelName: string) {
    super(sequelize, modelName);
  }
}

export class MYSQLUserQueryRepository extends BaseQueryRepositorySequelize<
  User,
  UserCondDTO
> {
  constructor(readonly sequelize: Sequelize, readonly modelName: string) {
    super(sequelize, modelName);
  }
}
