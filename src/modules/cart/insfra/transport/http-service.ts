import { ICartUseCase } from "@modules/cart/interface";
import { Request, Response } from "express";
import { RPCCartProductRepository } from "../repository/rpc";

export class CartHTTPService {
  constructor(
    private readonly cartUseCase: ICartUseCase,

    private readonly productRPCRepository: RPCCartProductRepository
  ) {}

  async addProductToCartAPI(req: Request, res: Response) {
    const requester = res.locals.requester;
    const { sub: userId } = requester;
    const dto = { ...req.body, userId };
    const result = await this.cartUseCase.addProductToCart(dto);

    res.status(200).json({ data: result });
  }

  async removeProductFromCartAPI(req: Request, res: Response) {
    const requester = res.locals.requesters;
    const { sub: userId } = requester;
    const { id } = req.params;

    const result = await this.cartUseCase.removeProductFromCart(id, userId);
    res.status(200).json({ data: result });
  }

  async updateItemsFromCartAPI(req: Request, res: Response) {
    const requester = res.locals.requesters;
    const { sub: userId } = requester;
    const { id } = req.params;

    res.status(200).json({ data: true });
  }

  async listItemsAPI(req: Request, res: Response) {
    const requester = res.locals.requesters;
    const { sub: userId } = requester;
    const result = await this.cartUseCase.getListCarts(userId);
    res.status(200).json({ data: result });
  }
}
