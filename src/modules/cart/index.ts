import { config } from "@share/component/config";
import { Router } from "express";
import { Sequelize } from "sequelize";
import { init, modelName } from "./insfra/repository/mysql/dto";
import { ServiceContext } from "@share/interface/service-context";
import { UserRole } from "@share/interface";
import { CartUseCase } from "./usecase";
import { CartHTTPService } from "./insfra/transport/http-service";
import { RPCCartProductRepository } from "./insfra/repository/rpc";
import { CartRepository } from "./insfra/repository/mysql";
export function setupCartHexagon(
  sequelize: Sequelize,
  sctx: ServiceContext
): Router {
  init(sequelize);

  const cartRepository = new CartRepository(sequelize, modelName);
  const productRPCRepository = new RPCCartProductRepository(
    config.rpc.cartProduct
  );
  const cartUseCase = new CartUseCase(
    cartRepository,
    cartRepository,
    productRPCRepository
  );
  const cartHTTPService = new CartHTTPService(
    cartUseCase,
    productRPCRepository
  );

  const router = Router();
  const mdlFactory = sctx.mdlFactory;
  const adminChecker = mdlFactory.allowRoles([UserRole.ADMIN]);
  const userChecker = mdlFactory.allowRoles([UserRole.USER]);
  router.post(
    "/carts",
    mdlFactory.auth,
    userChecker,
    cartHTTPService.addProductToCartAPI.bind(cartHTTPService)
  );
  //   router.get("/carts/:id", cartHTTPService.get.bind(cartHTTPService));
  router.get(
    "/carts",
    mdlFactory.auth,
    userChecker,
    cartHTTPService.listItemsAPI.bind(cartHTTPService)
  );
  router.patch(
    "/carts/:id",
    mdlFactory.auth,
    userChecker,
    cartHTTPService.updateItemsFromCartAPI.bind(cartHTTPService)
  );
  router.delete(
    "/carts/:id",
    mdlFactory.auth,
    userChecker,
    cartHTTPService.removeProductFromCartAPI.bind(cartHTTPService)
  );

  return router;
}
