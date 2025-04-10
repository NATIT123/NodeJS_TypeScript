import "module-alias/register";

import express, { NextFunction, Request, Response } from "express";
import { setupCategoryHexagon } from "@modules/category";
import { config } from "dotenv";
import { sequelize } from "@share/component/sequelize";
import { setupBrandHexagon } from "@modules/brand";
import { setupProductHexagon } from "./modules/product";
import { setupUserHexagon } from "./modules/user";
import { TokenIntrospectRPCClient } from "./share/repository/verify-token.rpc";
import { authMiddleware } from "./share/middleware/auth";
import { allowRoles } from "./share/middleware/check-role";
import { UserRole } from "./share/interface";
import { setupMiddlewares } from "./share/middleware";
import { responseErr } from "./share/app-error";
import { setupCartHexagon } from "./modules/cart";
config();
(async () => {
  sequelize
    .authenticate()
    .then(() => {
      console.log("Connected to the database successfully.");
    })
    .catch((err: any) => {
      console.error("Unable to connect to the database:", err);
    });
  const app = express();
  const port = process.env.PORT || 3000;
  app.use(express.json());
  // app.use(morgan("dev"));

  const introspector = new TokenIntrospectRPCClient(
    process.env.VERIFY_TOKEN_URL || "http://localhost:3000/v1/rpc/introspect"
  );
  const authMdl = authMiddleware(introspector);
  app.get(
    "/v1/protected",
    authMdl,
    allowRoles([UserRole.USER]),
    (req: Request, res: Response) => {
      return res.status(200).json({
        data: res.locals.requester,
      });
    }
  );

  app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!");
  });

  const sctx = { mdlFactory: setupMiddlewares(introspector) };

  app.use("/v1", setupCategoryHexagon(sequelize, sctx));
  app.use("/v1", setupBrandHexagon(sequelize, sctx));
  app.use("/v1", setupProductHexagon(sequelize, sctx));
  app.use("/v1", setupUserHexagon(sequelize, sctx));
  app.use("/v1", setupCartHexagon(sequelize, sctx));

  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    responseErr(err, res);
    // return next();
  });

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
})();
