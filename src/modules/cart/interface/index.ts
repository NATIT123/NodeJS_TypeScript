import { PagingDTO } from "@/share/model/paging";
import {
  AddCartItemDTO,
  CartItem,
  CartItemConDTO,
  CartProduct,
  UpdateCartItemDTO,
} from "../model";

export interface ICartUseCase {
  addProductToCart(data: AddCartItemDTO): Promise<boolean>;
  getDetailCart(id: string): Promise<CartItem | null>;
  getListCarts(cond: CartItemConDTO, paging: PagingDTO): Promise<CartItem[]>;
  updateCart(id: string, data: UpdateCartItemDTO): Promise<boolean>;
  deleteCart(id: string): Promise<boolean>;
}

export interface ICartQueryRepository {
  get(id: string): Promise<CartItem | null>;
  listItems(userId: string): Promise<CartItem[]>;
  findByCond(cond: CartItemConDTO): Promise<CartItem | null>;
}

export interface ICartCommandRepository {
  insert(data: CartItem): Promise<boolean>;
  update(id: string, data: UpdateCartItemDTO): Promise<boolean>;
  delete(id: string, isHard: boolean): Promise<boolean>;
}

export interface IProductQueryRepository {
  findById(id: string): Promise<CartProduct | null>;
  findByIds(ids: string[]): Promise<CartProduct[]>;
}
