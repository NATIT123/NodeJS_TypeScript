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
import {
  BaseCommandRepositorySequelize,
  BaseQueryRepositorySequelize,
  BaseRepositorySequelize,
} from "@share/repository/repo-sequelize";
import { Sequelize } from "sequelize";

export class CartRepository
  implements ICartQueryRepository, ICartCommandRepository
{
  constructor(readonly sequelize: Sequelize, readonly modelName: string) {}
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
  delete(id: string, isHard: boolean): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  get(id: string): Promise<CartItem | null> {
    throw new Error("Method not implemented.");
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
  findByCond(cond: CartItemConDTO): Promise<CartItem | null> {
    throw new Error("Method not implemented.");
  }
}
