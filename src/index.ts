import "module-alias/register";

import express, { Request, Response } from "express";
import { setupCategoryHexagon } from "@modules/category";
import { config } from "dotenv";
import { sequelize } from "@share/component/sequelize";
import { setupBrandHexagon } from "@modules/brand";
import { setupProductHexagon } from "./modules/product";
import { setupUserHexagon } from "./modules/user";
config();
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

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.use("/v1", setupCategoryHexagon(sequelize));
app.use("/v1", setupBrandHexagon(sequelize));
app.use("/v1", setupProductHexagon(sequelize));
app.use("/v1", setupUserHexagon(sequelize));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
