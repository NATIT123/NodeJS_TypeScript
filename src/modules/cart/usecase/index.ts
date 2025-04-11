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
  updateCartItemDTOSchema,
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

    const listIds: string[] = items.map((cart) => cart.productId);

    const listProducts: CartProduct[] | null =
      await this.productQueryRepo.findByIds(listIds);

    const myProducts: { [key: string]: CartProduct } = {};

    if (listProducts && listProducts.length > 0) {
      listProducts.forEach((item) => {
        if (item.id) {
          myProducts[item.id] = item as CartProduct;
        }
      });
    }

    const result = items.map((cart) => {
      let product = null;
      if (listProducts) {
        product = myProducts[cart.productId as string] ?? null;
      }

      return {
        ...cart,
        product,
      } as CartItem;
    });

    return result;
  }
  async updateCart(
    dto: UpdateCartItemDTO[],
    requesterId: string
  ): Promise<boolean> {
    dto = dto.map((item) => updateCartItemDTOSchema.parse(item));
    const productIds = dto.map((item) => item.productId);

    const products = await this.productQueryRepo.findByIds(productIds);
    const productQuantityMap = new Map<string, number>();

    products?.forEach((product) =>
      productQuantityMap.set(product.id, product.quantity)
    );

    dto.forEach((item) => {
      const userWantQuantity = item.quantity;
      const currentQuantity = productQuantityMap.get(item.productId) || 0;

      if (userWantQuantity > currentQuantity) {
        throw AppError.from(ErrProductNotEnoughQuantity, 400);
      }
    });

    await this.cartCommandRepo.updateMany(dto, requesterId);

    return true;
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
