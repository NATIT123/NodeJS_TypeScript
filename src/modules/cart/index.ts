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
export function setupProductHexagon(
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
  const cartHTTPService = new CartHTTPService(cartUseCase);

  const router = Router();
  const mdlFactory = sctx.mdlFactory;
  const adminChecker = mdlFactory.allowRoles([UserRole.ADMIN]);
  router.post(
    "/carts",
    adminChecker,
    cartHTTPService.addProductToCartAPI.bind(cartHTTPService)
  );
  //   router.get("/carts/:id", cartHTTPService.get.bind(cartHTTPService));
  //   router.get(
  //     "/carts",
  //     adminChecker,
  //     cartHTTPService.listAPI.bind(cartHTTPService)
  //   );
  //   router.patch(
  //     "/carts/:id",
  //     adminChecker,
  //     cartHTTPService.updateAPI.bind(cartHTTPService)
  //   );
  //   router.delete(
  //     "/carts/:id",
  //     adminChecker,
  //     cartHTTPService.deleteAPI.bind(cartHTTPService)
  //   );

  return router;
}
