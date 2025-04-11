import {
  ICartCommandRepository,
  ICartQueryRepository,
} from "@/modules/cart/interface";
import { PagingDTO } from "@/share/model/paging";
import {
  CartItem,
  CartItemConDTO,
  cartItemSchema,
  UpdateCartItemDTO,
} from "@modules/cart/model";
import { Sequelize } from "sequelize";

export class CartRepository
  implements ICartQueryRepository, ICartCommandRepository
{
  constructor(readonly sequelize: Sequelize, readonly modelName: string) {}
  async updateMany(
    dtos: UpdateCartItemDTO[],
    userId: string
  ): Promise<boolean> {
    await this.sequelize.transaction(async (t) => {
      for (let i = 0; i < dtos.length; i++) {
        const { productId, attribute, quantity } = dtos[i];
        await this.sequelize.models[this.modelName].update(
          { quantity },
          { where: { productId, userId, attribute }, transaction: t }
        );
      }
      return true;
    });

    return true;
  }
  async insert(data: CartItem): Promise<boolean> {
    await this.sequelize.models[this.modelName].create(data);
    return true;
  }
  async update(id: string, data: UpdateCartItemDTO): Promise<boolean> {
    await this.sequelize.models[this.modelName].update(data, {
      where: { id },
    });
    return true;
  }
  async delete(id: string, isHard: boolean): Promise<boolean> {
    await this.sequelize.models[this.modelName].destroy({ where: { id } });
    return true;
  }
  async get(id: string): Promise<CartItem | null> {
    const data = await this.sequelize.models[this.modelName].findByPk(id);

    if (!data) {
      return null;
    }

    const persistenceData = data.get({ plain: true });

    return {
      ...persistenceData,
      createdAt: persistenceData.created_at.toISOString(),
      updatedAt: persistenceData.updated_at.toISOString(),
    } as CartItem;

    // return CategorySchema.parse(data.get({ plain: true }));
  }

  async listItems(userId: string): Promise<CartItem[]> {
    const items = await this.sequelize.models[this.modelName].findAll({
      where: { userId },
    });

    return items.map((row) => {
      const persistenceData = row.get({ plain: true });
      const { createdAt, updatedAt, ...props } = persistenceData;

      return {
        ...props,
        createdAt: persistenceData.createdAt,
        updatedAt: persistenceData.updatedAt,
      } as CartItem;
    });
  }
  async findByCond(cond: CartItemConDTO): Promise<CartItem | null> {
    const data = await this.sequelize.models[this.modelName].findOne({
      where: {
        userId: cond.userId,
        productId: cond.productId,
        attribute: cond.attribute,
      },
    });

    if (!data) {
      return null;
    }

    const persistenceData = data.get({ plain: true });

    return {
      ...persistenceData,
      createdAt: persistenceData.created_at.toISOString(),
      updatedAt: persistenceData.updated_at.toISOString(),
    } as CartItem;
  }
}
