import {
  ICartQueryRepository,
  IProductQueryRepository,
} from "@modules/cart/interface";
import {
  CartItem,
  CartItemConDTO,
  CartProduct,
  cartProductSchema,
} from "@modules/cart/model";
import { PagingDTO } from "@/share/model/paging";

import axios from "axios";

export class RPCCartProductRepository implements IProductQueryRepository {
  constructor(private readonly productServiceUrl: string) {}
  async findById(id: string): Promise<CartProduct | null> {
    try {
      const { data } = await axios.get(
        `${this.productServiceUrl}/v1/products/${id}`
      );

      const product = cartProductSchema.parse(data.data);

      return {
        id: product.id,
        name: product.name,
        images: product.images,
        salePrice: product.salePrice,
        price: product.price,
        quantity: product.quantity,
      };
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  async findByIds(ids: string[]): Promise<CartProduct[] | null> {
    try {
      const { data } = await axios.post(
        `${this.productServiceUrl}/v1/rpc/products-by-ids`,
        { ids }
      );

      const products = data.data;

      return products.map((product: any) => ({
        id: product.id,
        name: product.name,
        images: product.images,
        salePrice: product.salePrice,
        price: product.price,
        quantity: product.quantity,
      }));
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
