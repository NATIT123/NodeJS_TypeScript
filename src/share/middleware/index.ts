import { ITokenIntrospect } from "../interface";

import { Handler } from "express";
import { UserRole } from "../interface";
import { authMiddleware } from "./auth";
import { allowRoles } from "./check-role";

export interface MdlFactory {
  auth: Handler;
  allowRoles: (roles: UserRole[]) => Handler;
}

export const setupMiddlewares = (
  introspector: ITokenIntrospect,
): MdlFactory => {

  const auth = authMiddleware(introspector);

  return {
    auth,
    allowRoles,
  };
};