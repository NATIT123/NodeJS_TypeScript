import { Op } from "sequelize";
import { ModelStatus } from "../../../../share/model/base-model";
import { PagingDTO } from "../../../../share/model/paging";
import { IReposiotry } from "../../interface";
import { CategoryCondDTO, CategoryCondDTOSchema } from "../../model/dto";
import { Category, CategorySchema } from "../../model/model";
import { Sequelize } from "sequelize";

//implement ORM
export class CategoryRepository implements IReposiotry {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly modelName: string
  ) {}
  async delete(id: string, isHard: boolean = false): Promise<boolean> {
    if (isHard) {
      await this.sequelize.models[this.modelName].update(
        { status: ModelStatus.DELETED },
        { where: { id } }
      );
    } else {
      await this.sequelize.models[this.modelName].destroy({ where: { id } });
    }

    return true;
  }
  async insert(data: Category): Promise<boolean> {
    await this.sequelize.models[this.modelName].create(data);
    return true;
  }
  async update(id: string, data: Partial<Category>): Promise<boolean> {
    await this.sequelize.models[this.modelName].update(data, { where: { id } });
    return true;
  }

  async get(id: string): Promise<Category | null> {
    const data = await this.sequelize.models[this.modelName].findByPk(id);

    if (!data) {
      return null;
    }

    const persistenceData = data.get({ plain: true });

    return {
      ...persistenceData,
      children: [],
      createdAt: persistenceData.created_at.toISOString(),
      updatedAt: persistenceData.updated_at.toISOString(),
    } as Category;

    // return CategorySchema.parse(data.get({ plain: true }));
  }
  async list(cond: CategoryCondDTO, paging: PagingDTO): Promise<Category[]> {
    const { page, limit } = paging;
    const condSQL = { ...cond, status: { [Op.ne]: ModelStatus.DELETED } };
    const total = await this.sequelize.models[this.modelName].count({
      where: condSQL,
    });
    paging.total = total;
    const rows = await this.sequelize.models[this.modelName].findAll({
      limit,
      offset: (page - 1) * limit,
      where: condSQL,
      order: [["created_at", "DESC"]],
    });

    return rows.map((row) => {
      const plainRow = row.get({ plain: true });

      plainRow.createdAt = plainRow.created_at;
      delete plainRow.created_at;

      plainRow.updatedAt = plainRow.updated_at;
      delete plainRow.updated_at;

      return CategorySchema.parse(plainRow);
    });
  }
}
