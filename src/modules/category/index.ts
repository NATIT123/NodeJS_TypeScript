import { Router } from "express";
import { getCategoryApi } from "./infras/get-api";
import { listCategoriesApi } from "./infras/list-api";
import { createCategoryApi } from "./infras/create-api";
import { deleteCategoryApi } from "./infras/delete-api";
import { updateCategoryApi } from "./infras/update-api";
import { init, modelName } from "./infras/repository/dto";
import { Sequelize } from "sequelize";
import { CategoryHttpService } from "./infras/transport/http-service";
import { CategoryUseCase } from "./usecase";
import { CategoryRepository } from "./infras/repository/repo";
import { ServiceContext } from "@share/interface/service-context";
import { UserRole } from "@share/interface";
export const setupCategoryModule = (sequelize: Sequelize) => {
  init(sequelize);
  const router = Router();
  router.get("/categories", listCategoriesApi);
  router.get("/categories/:id", getCategoryApi);
  router.patch("/categories/:id", updateCategoryApi);
  router.post("/categories", createCategoryApi);
  router.delete("/categories/:id", deleteCategoryApi);
  return router;
};

export const setupCategoryHexagon = (
  sequelize: Sequelize,
  sctx: ServiceContext
) => {
  init(sequelize);

  const repository = new CategoryRepository(sequelize, modelName);
  const useCase = new CategoryUseCase(repository);
  const httpService = new CategoryHttpService(useCase);
  const router = Router();
  const mdlFactory = sctx.mdlFactory;
  const adminChecker = mdlFactory.allowRoles([UserRole.ADMIN]);
  router.get(
    "/categories",
    mdlFactory.auth,
    adminChecker,
    httpService.listCategoriesApi.bind(httpService)
  );
  router.get(
    "/categories/:id",
    httpService.getDetailCategoryAPI.bind(httpService)
  );
  router.patch(
    "/categories/:id",
    mdlFactory.auth,
    adminChecker,
    updateCategoryApi
  );
  router.post(
    "/categories",
    mdlFactory.auth,
    adminChecker,
    httpService.createANewCategoryApi.bind(httpService)
  );
  router.delete(
    "/categories/:id",
    mdlFactory.auth,
    adminChecker,
    httpService.deleteCategoryApi.bind(httpService)
  );
  return router;
};
