import jwt from "jsonwebtoken";
import { ITokenProvider, TokenPayload } from "../interface";
import { config } from "./config";

class JwtTokenService implements ITokenProvider {
  private readonly secretKeyAccess: string;
  private readonly secretKeyRefresh: string;
  private readonly expiresInAccess: number | string;
  private readonly expiresInRefresh: number | string;

  constructor(
    secretKeyAccess: string,
    secretKeyRefresh: string,
    expiresInAccess: string | number,
    expiresInRefresh: string | number
  ) {
    this.secretKeyAccess = secretKeyAccess;
    this.expiresInAccess = expiresInAccess;
    this.expiresInRefresh = expiresInRefresh;
    this.secretKeyRefresh = secretKeyRefresh;
  }

  async generateAccessToken(payload: TokenPayload): Promise<string> {
    return jwt.sign(payload, this.secretKeyAccess, {
      expiresIn: this.expiresInAccess, // để nguyên "7d"
    });
  }

  async generateRefreshToken(payload: TokenPayload): Promise<string> {
    return jwt.sign(payload, this.secretKeyRefresh, {
      expiresIn: this.expiresInRefresh, // để nguyên "7d"
    });
  }

  async verifyToken(
    token: string,
    secretKey: string
  ): Promise<TokenPayload | null> {
    const decoded = jwt.verify(token, secretKey) as TokenPayload;
    return decoded;
  }
}

export const jwtProvider = new JwtTokenService(
  config.accessToken.secretKey,
  config.refreshToken.secretKey,
  config.accessToken.expiresIn,
  config.refreshToken.expiresIn
);
