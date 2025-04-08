import { IUseCase, TokenPayload, UserToken } from "@share/interface";
import {
  User,
  UserCondDTO,
  UserLoginDTO,
  UserRegistrationDTO,
  UserUpdateDTO,
} from "../model";

export interface IUserUseCase
  extends IUseCase<UserRegistrationDTO, UserUpdateDTO, User, UserCondDTO> {
  login(data: UserLoginDTO): Promise<UserToken>;
  register(data: UserRegistrationDTO): Promise<string>;
  profile(userId: string): Promise<User>;
  verifyToken(token: string): Promise<TokenPayload>;
}
