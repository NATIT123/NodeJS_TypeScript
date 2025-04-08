import { modelName, init } from "./infras/repository/sequelize/dto";
import { Router } from "express";

import { Sequelize } from "sequelize";
import { MySQLBrandRepository } from "./infras/repository/sequelize";
import { BrandHttpService } from "./infras/transport";
import { CreateNewBrandHandler } from "./usecase/create-new-brand";
import { GetBrandDetailQuery } from "./usecase/get-brand-detail";
import { UpdateBrandHandler } from "./usecase/update-brand";
import { DeleteBrandHandler } from "./usecase/delete-brand";
import { GetListBrandQuery } from "./usecase/get-list-brand";

export const setupBrandHexagon = (sequelize: Sequelize) => {
  init(sequelize);

  const repository = new MySQLBrandRepository(sequelize);
  const createCmdHandler = new CreateNewBrandHandler(repository);
  const getDetailQueryHandler = new GetBrandDetailQuery(repository);
  const updateCmdHandler = new UpdateBrandHandler(repository);
  const deleteCmdHandler = new DeleteBrandHandler(repository);
  const listCmdHandler = new GetListBrandQuery(repository);
  const httpService = new BrandHttpService(
    createCmdHandler,
    getDetailQueryHandler,
    updateCmdHandler,
    deleteCmdHandler,
    listCmdHandler
  );
  const router = Router();
  router.get("/brands", httpService.listBrandsApi.bind(httpService));
  router.get("/brands/:id", httpService.getDetailBrandAPI.bind(httpService));
  router.patch("/brands/:id", httpService.updateBrandApi.bind(httpService));
  router.post("/brands", httpService.createANewBrandApi.bind(httpService));
  router.delete("/brands/:id", httpService.deleteBrandApi.bind(httpService));
  return router;
};
