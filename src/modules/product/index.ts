import { config } from "@share/component/config";
import { Router } from "express";
import { Sequelize } from "sequelize";
import { init, modelName } from "./insfra/repository/mysql/dto";
import { MySQLProductRepository } from "./insfra/repository/mysql/mysql-repo";
import {
  ProxyProductBrandRepository,
  RPCProductBrandRepository,
  RPCProductCategoryRepository,
} from "./insfra/repository/rpc";
import { ProductHTTPService } from "./insfra/transport/http-service";
import { ProductUseCase } from "./usecase";
import { ServiceContext } from "@share/interface/service-context";
import { UserRole } from "@share/interface";

export function setupProductHexagon(
  sequelize: Sequelize,
  sctx: ServiceContext
): Router {
  init(sequelize);

  const productRepository = new MySQLProductRepository(sequelize, modelName);

  const productBrandRepository = new ProxyProductBrandRepository(
    new RPCProductBrandRepository(config.rpc.productBrand)
  );
  const productCategoryRepository = new RPCProductCategoryRepository(
    config.rpc.productCategory
  );
  // const productBrandRepository = new MySQLBrandRespository(sequelize);

  const productUseCase = new ProductUseCase(
    productRepository,
    productBrandRepository,
    productCategoryRepository
  );

  const productHttpService = new ProductHTTPService(
    productUseCase,
    productBrandRepository,
    productCategoryRepository
  );

  const router = Router();
  const mdlFactory = sctx.mdlFactory;
  const adminChecker = mdlFactory.allowRoles([UserRole.ADMIN]);
  router.post(
    "/products",
    adminChecker,
    productHttpService.createAPI.bind(productHttpService)
  );
  router.get(
    "/products/:id",
    productHttpService.getDetailAPI.bind(productHttpService)
  );
  router.get(
    "/products",
    adminChecker,
    productHttpService.listAPI.bind(productHttpService)
  );
  router.patch(
    "/products/:id",
    adminChecker,
    productHttpService.updateAPI.bind(productHttpService)
  );
  router.delete(
    "/products/:id",
    adminChecker,
    productHttpService.deleteAPI.bind(productHttpService)
  );

  return router;
}
