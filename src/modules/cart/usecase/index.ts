import {
  ICartCommandRepository,
  ICartQueryRepository,
  ICartUseCase,
  IProductQueryRepository,
} from "../interface";
import {
  AddCartItemDTO,
  addCartItemDTOSchema,
  CartItem,
  CartItemConDTO,
  CartProduct,
  UpdateCartItemDTO,
} from "../model";
import {
  ErrCartItemNotFound,
  ErrProductNotEnoughQuantity,
  ErrProductNotFound,
} from "../model/error";
import { v7 } from "uuid";
import { AppError, ErrForbidden } from "@share/app-error";

export class CartUseCase implements ICartUseCase {
  constructor(
    private readonly cartQueryRepo: ICartQueryRepository,
    private readonly cartCommandRepo: ICartCommandRepository,
    private readonly productQueryRepo: IProductQueryRepository
  ) {}
  async addProductToCart(data: AddCartItemDTO): Promise<boolean> {
    const dto = addCartItemDTOSchema.parse(data);
    let product;
    if (dto.productId) {
      product = await this.productQueryRepo.findById(dto.productId);
      if (!product) {
        throw AppError.from(ErrProductNotFound, 400);
      }
    }

    ///2 Check if the product is already in cart
    const { userId, productId, attribute, quantity } = dto;
    const existingItem = await this.cartQueryRepo.findByCond({
      userId,
      productId,
      attribute,
    });
    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (product!.quantity < newQuantity)
        throw AppError.from(ErrProductNotEnoughQuantity, 400);

      await this.cartCommandRepo.update(existingItem.id, {
        ...existingItem,
        quantity: newQuantity,
        updatedAt: new Date(),
      });
    } else {
      if (quantity > product!.quantity)
        throw AppError.from(ErrProductNotEnoughQuantity, 400);
      const newId = v7();
      const newItem: CartItem = {
        ...dto,
        id: newId,
        productId: product?.id as string,
        product,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await this.cartCommandRepo.insert(newItem);
    }

    return true;
  }
  getDetailCart(id: string): Promise<CartItem | null> {
    throw new Error("Method not implemented.");
  }
  async getListCarts(requesterId: string): Promise<CartItem[] | null> {
    const items = await this.cartQueryRepo.listItems(requesterId);

    ///1Get cart products by ids

    return items;
  }
  updateCart(id: string, data: UpdateCartItemDTO): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  async removeProductFromCart(
    id: string,
    requesterId: string
  ): Promise<boolean> {
    const existingItem = await this.cartQueryRepo.get(id);
    if (!existingItem) {
      throw AppError.from(ErrCartItemNotFound, 400);
    }

    if (existingItem.userId !== requesterId) {
      throw ErrForbidden.withLog("This item not belong to this users");
    }
    await this.cartCommandRepo.delete(id, false);
    return true;
  }
}
