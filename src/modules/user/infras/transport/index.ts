import { config } from "@share/component/config";
import { IUserUseCase } from "@modules/user/interface";
import {
  User,
  UserCondDTO,
  UserRegistrationDTO,
  UserUpdateDTO,
} from "@modules/user/model";
import { jwtProvider } from "@share/component/jwt";
import { BaseHttpService } from "@share/transport/http-server";
import { Request, Response } from "express";

export class UserHTTPService extends BaseHttpService<
  User,
  UserRegistrationDTO,
  UserUpdateDTO,
  UserCondDTO
> {
  constructor(readonly usecase: IUserUseCase) {
    super(usecase);
  }

  async register(req: Request, res: Response) {
    await this.createAPI(req, res);
  }

  async login(req: Request, res: Response) {
    const token = await this.usecase.login(req.body);
    res.status(200).json({ data: token });
  }

  async profile(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const payload = await jwtProvider.verifyToken(
        token,
        config.accessToken.secretKey
      );

      if (!payload) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const { sub } = payload;

      const user = await this.usecase.profile(sub);

      const { salt, password, ...otherProps } = user;
      res.status(200).json({ data: otherProps });
    } catch (error) {
      res.status(400).json({
        message: (error as Error).message,
      });
    }
  }
  async introspectAPI(req: Request, res: Response) {
    try {
      const { token } = req.body;
      const result = await this.usecase.verifyToken(token);
      res.status(200).json({ data: result });
    } catch (error) {
      res.status(400).json({
        message: (error as Error).message,
      });
    }
  }
}
