import { ICartUseCase } from "@modules/cart/interface";
import { Request, Response } from "express";

export class CartHTTPService {
  constructor(private readonly cartUseCase: ICartUseCase) {}

  async addProductToCartAPI(req: Request, res: Response) {
    const requester = res.locals.requester;
    const { sub: userId } = requester;
    const dto = { ...req.body, userId };
    const result = await this.cartUseCase.addProductToCart(dto);

    res.status(200).json({ data: result });
  }
}
