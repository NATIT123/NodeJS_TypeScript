import { Router } from "express";
import { Sequelize } from "sequelize";
import { MySQLUserRepository } from "./infras/repository/mysql";
import { init, modelName } from "./infras/repository/mysql/dto";
import { UserHTTPService } from "./infras/transport";
import { UserUseCase } from "./usecase";

export const setupUserHexagon = (sequelize: Sequelize) => {
  init(sequelize);

  const repository = new MySQLUserRepository(sequelize, modelName);
  const useCase = new UserUseCase(repository);
  const httpService = new UserHTTPService(useCase);

  const router = Router();

  router.post('/register', httpService.register.bind(httpService));
  router.post('/authenticate', httpService.login.bind(httpService));
  router.get('/profile', httpService.profile.bind(httpService));
  
  router.post('/users', httpService.createAPI.bind(httpService));
  router.get('/users/:id', httpService.getDetailAPI.bind(httpService));
  router.get('/users', httpService.listAPI.bind(httpService));
  router.patch('/users/:id', httpService.updateAPI.bind(httpService));
  router.delete('/users/:id', httpService.deleteAPI.bind(httpService));

  return router;
};