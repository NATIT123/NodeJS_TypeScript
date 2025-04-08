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

export function setupProductHexagon(sequelize: Sequelize): Router {
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

  router.post(
    "/products",
    productHttpService.createAPI.bind(productHttpService)
  );
  router.get(
    "/products/:id",
    productHttpService.getDetailAPI.bind(productHttpService)
  );
  router.get("/products", productHttpService.listAPI.bind(productHttpService));
  router.patch(
    "/products/:id",
    productHttpService.updateAPI.bind(productHttpService)
  );
  router.delete(
    "/products/:id",
    productHttpService.deleteAPI.bind(productHttpService)
  );

  return router;
}
