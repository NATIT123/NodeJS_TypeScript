import { Router } from "express";
import { Sequelize } from "sequelize";
import { MySQLUserRepository } from "./infras/repository/mysql";
import { init, modelName } from "./infras/repository/mysql/dto";
import { UserHTTPService } from "./infras/transport";
import { UserUseCase } from "./usecase";
import { ServiceContext } from "@share/interface/service-context";
import { UserRole } from "@share/interface";
export const setupUserHexagon = (
  sequelize: Sequelize,
  sctx: ServiceContext
) => {
  init(sequelize);

  const repository = new MySQLUserRepository(sequelize, modelName);
  const useCase = new UserUseCase(repository);
  const httpService = new UserHTTPService(useCase);

  const router = Router();
  const mdlFactory = sctx.mdlFactory;
  const adminChecker = mdlFactory.allowRoles([UserRole.ADMIN]);

  router.post("/register", httpService.register.bind(httpService));
  router.post("/authenticate", httpService.login.bind(httpService));
  router.get("/profile", httpService.profile.bind(httpService));

  router.post("/users", adminChecker, httpService.createAPI.bind(httpService));
  router.get("/users/:id", httpService.getDetailAPI.bind(httpService));
  router.get("/users", adminChecker, httpService.listAPI.bind(httpService));
  router.patch("/users/:id", httpService.updateAPI.bind(httpService));
  router.delete(
    "/users/:id",
    adminChecker,
    httpService.deleteAPI.bind(httpService)
  );

  //RPC
  // RPC API (use internally)
  router.post("/rpc/introspect", httpService.introspectAPI.bind(httpService));
  return router;
};
