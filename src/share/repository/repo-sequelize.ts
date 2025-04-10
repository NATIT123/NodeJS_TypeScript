import { Op } from "sequelize";
import { Sequelize } from "sequelize";
import {
  ICommandRepository,
  IQueryRepository,
  IRepository,
} from "../interface";
import { ModelStatus } from "../model/base-model";
import { PagingDTO } from "../model/paging";
//implement ORM
export abstract class BaseRepositorySequelize<Entity, Cond, UpdateDTO>
  implements IRepository<Entity, Cond, UpdateDTO>
{
  constructor(
    readonly queryRepo: IQueryRepository<Entity, Cond>,
    readonly cmdRepo: ICommandRepository<Entity, UpdateDTO>,
    readonly schema: any
  ) {}
  async listByIds(ids: string[]): Promise<Entity[]> {
    return await this.queryRepo.listByIds(ids);
  }

  async get(id: string): Promise<Entity | null> {
    return await this.queryRepo.get(id);
  }

  async findByCond(cond: Cond): Promise<Entity | null> {
    return await this.queryRepo.findByCond(cond);
  }

  async list(cond: Cond, paging: PagingDTO): Promise<Array<Entity>> {
    return await this.queryRepo.list(cond, paging);
  }

  async insert(data: Entity): Promise<boolean> {
    return await this.cmdRepo.insert(data);
  }

  async update(id: string, data: UpdateDTO): Promise<boolean> {
    return await this.cmdRepo.update(id, data);
  }

  async delete(id: string, isHard: boolean): Promise<boolean> {
    return await this.cmdRepo.delete(id, isHard);
  }
}

export abstract class BaseQueryRepositorySequelize<Entity, Cond>
  implements IQueryRepository<Entity, Cond>
{
  constructor(readonly sequelize: Sequelize, readonly modelName: string) {}
  async listByIds(ids: string[]): Promise<Entity[]> {
    const rows = await this.sequelize.models[this.modelName].findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
        status: {
          [Op.ne]: ModelStatus.DELETED,
        },
      },
    });
    return rows.map((row) => {
      const persistenceData = row.get({ plain: true });
      const { created_at, updated_at, ...props } = persistenceData;

      return {
        ...props,
        createdAt: persistenceData.created_at,
        updatedAt: persistenceData.updated_at,
      } as Entity;
    });
  }

  async get(id: string): Promise<Entity | null> {
    const data = await this.sequelize.models[this.modelName].findByPk(id);

    if (!data) {
      return null;
    }

    const persistenceData = data.get({ plain: true });
    const { created_at, updated_at, ...props } = persistenceData;

    return {
      ...props,
      createdAt: persistenceData.created_at,
      updatedAt: persistenceData.updated_at,
    } as Entity;
  }

  async findByCond(cond: Cond): Promise<Entity | null> {
    const data = await this.sequelize.models[this.modelName].findOne({
      where: cond as any,
    });

    if (!data) {
      return null;
    }

    const persistenceData = data.get({ plain: true });
    return persistenceData as Entity;
  }

  async list(cond: Cond, paging: PagingDTO): Promise<Array<Entity>> {
    const { page, limit } = paging;

    const condSQL = { ...cond, status: { [Op.ne]: ModelStatus.DELETED } };

    const total = await this.sequelize.models[this.modelName].count({
      where: condSQL,
    });
    paging.total = total;

    const rows = await this.sequelize.models[this.modelName].findAll({
      where: condSQL,
      limit,
      offset: (page - 1) * limit,
      order: [["id", "DESC"]],
    });

    return rows.map((row) => row.get({ plain: true }));
  }
}

export abstract class BaseCommandRepositorySequelize<Entity, UpdateDTO>
  implements ICommandRepository<Entity, UpdateDTO>
{
  constructor(readonly sequelize: Sequelize, readonly modelName: string) {}

  async insert(data: Entity): Promise<boolean> {
    await this.sequelize.models[this.modelName].create(data as any);
    return true;
  }

  async update(id: string, data: UpdateDTO): Promise<boolean> {
    await this.sequelize.models[this.modelName].update(data as any, {
      where: { id },
    });
    return true;
  }

  async delete(id: string, isHard: boolean = false): Promise<boolean> {
    if (!isHard) {
      await this.sequelize.models[this.modelName].update(
        { status: ModelStatus.DELETED },
        { where: { id } }
      );
    } else {
      await this.sequelize.models[this.modelName].destroy({ where: { id } });
    }

    return true;
  }
}
