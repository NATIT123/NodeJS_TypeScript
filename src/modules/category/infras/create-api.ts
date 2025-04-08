import { ModelStatus } from "./../../../share/model/base-model";
import { CategoryCreateSchema } from "../model/dto";
import { Request, Response } from "express";
import { v7 } from "uuid";
import { CategoryPersistence } from "./repository/dto";
export const createCategoryApi = async (req: Request, res: Response) => {
  try {
    const result = CategoryCreateSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({ error: result.error.errors });
    }

    const { name, image, description, parentId } = result.data;

    const newId = v7(); // Generate a new UUID for the category
    const newCategory = {
      id: newId,
      name,
      image,
      description,
      parentId,
      status: ModelStatus.ACTIVE,
      created_at: new Date(),
      updated_at: new Date(),
    };
    const category = await CategoryPersistence.create(newCategory);

    res.status(201).json({ id: newId });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
    return;
  }
};
