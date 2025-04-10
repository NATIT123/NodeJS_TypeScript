import { PagingDTO } from "@/share/model/paging";
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
  ErrProductNotEnoughQuantity,
  ErrProductNotFound,
} from "../model/error";
import { v7 } from "uuid";
import { AppError } from "@/share/app-error";

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
      const updatedItem = {
        ...existingItem,
        quantity: existingItem.quantity + 1,
      };
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
  getListCarts(cond: CartItemConDTO, paging: PagingDTO): Promise<CartItem[]> {
    throw new Error("Method not implemented.");
  }
  updateCart(id: string, data: UpdateCartItemDTO): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  deleteCart(id: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}
