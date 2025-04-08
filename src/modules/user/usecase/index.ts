import { jwtProvider } from "@share/component/jwt";
import {
  IRepository,
  TokenPayload,
  UserRole,
  UserToken,
} from "@share/interface";
import { ErrDataNotFound } from "@share/model/base-error";
import { PagingDTO } from "@share/model/paging";
import bcrypt from "bcrypt";
import { v7 } from "uuid";
import { IUserUseCase } from "../interface";
import {
  Gender,
  Role,
  Status,
  User,
  UserCondDTO,
  userCondDTOSchema,
  UserLoginDTO,
  UserLoginDTOSchema,
  UserRegistrationDTO,
  UserRegistrationDTOSchema,
  UserUpdateDTO,
  userUpdateDTOSchema,
} from "../model";
import {
  ErrEmailExisted,
  ErrInvalidEmailAndPassword,
  ErrUserInactivated,
} from "../model/error";

export class UserUseCase implements IUserUseCase {
  constructor(
    private readonly repository: IRepository<User, UserCondDTO, UserUpdateDTO>
  ) {}

  async profile(userId: string): Promise<User> {
    const user = await this.repository.get(userId);
    if (!user) {
      throw ErrDataNotFound;
    }

    return user;
  }

  verifyToken(token: string): Promise<TokenPayload> {
    throw new Error("Method not implemented.");
  }

  async login(data: UserLoginDTO): Promise<UserToken> {
    const dto = UserLoginDTOSchema.parse(data);

    // 1. Find user with email from DTO
    const user = await this.repository.findByCond({ email: dto.email });
    if (!user) {
      throw ErrInvalidEmailAndPassword;
    }

    // 2. Check password
    const isMatch = await bcrypt.compare(
      `${dto.password}.${user.salt}`,
      user.password
    );
    if (!isMatch) {
      throw ErrInvalidEmailAndPassword;
    }

    if (user.status === Status.DELETED || user.status === Status.INACTIVE) {
      throw ErrUserInactivated;
    }

    // 3. Return token
    const role = user.role === Role.ADMIN ? UserRole.ADMIN : UserRole.USER;
    const accessToken = await jwtProvider.generateAccessToken({
      sub: user.id,
      role: role,
    });
    const refreshToken = await jwtProvider.generateRefreshToken({
      sub: user.id,
      role: role,
    });
    return { accessToken, refreshToken };
  }

  async register(data: UserRegistrationDTO): Promise<string> {
    const dto = UserRegistrationDTOSchema.parse(data);

    // 1. Check email existed
    const existedUser = await this.repository.findByCond({ email: dto.email });
    if (existedUser) {
      throw ErrEmailExisted;
    }

    // 2. Gen salt and hash password
    // const salt = generateRandomString(20);
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = await bcrypt.hash(`${dto.password}.${salt}`, 10);

    // 3. Create new user
    const newId = v7();
    const newUser: User = {
      ...dto,
      password: hashPassword,
      id: newId,
      status: Status.ACTIVE,
      gender: Gender.UNKNOWN,
      salt: salt,
      role: Role.USER,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // 4. Insert new user to database
    await this.repository.insert(newUser);

    return newId;
  }

  async create(data: UserRegistrationDTO): Promise<string> {
    return await this.register(data);
  }

  async getDetail(id: string): Promise<User | null> {
    const data = await this.repository.get(id);

    if (!data || data.status === Status.DELETED) {
      throw ErrDataNotFound;
    }

    return data;
  }

  async update(id: string, data: UserUpdateDTO): Promise<boolean> {
    const dto = userUpdateDTOSchema.parse(data);

    const user = await this.repository.get(id);
    if (!user || user.status === Status.DELETED) {
      throw ErrDataNotFound;
    }

    await this.repository.update(id, dto);

    return true;
  }

  async list(cond: UserCondDTO, paging: PagingDTO): Promise<User[]> {
    const parsedCond = userCondDTOSchema.parse(cond);

    return await this.repository.list(parsedCond, paging);
  }

  async delete(id: string): Promise<boolean> {
    const user = await this.repository.get(id);

    if (!user || user.status === Status.DELETED) {
      throw ErrDataNotFound;
    }

    await this.repository.delete(id, false);

    return true;
  }
}
