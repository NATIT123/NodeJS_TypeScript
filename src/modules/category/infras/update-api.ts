import { Request, Response } from "express";
import { CategoryUpdateSchema } from "../model/dto";
import { CategoryPersistence } from "./repository/dto";
export const updateCategoryApi = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = CategoryUpdateSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({ error: result.error.errors });
    }

    const currentCategory = await CategoryPersistence.findByPk(id);

    if (!currentCategory) {
      return res.status(404).json({ error: "Category not found" });
    }

    if (currentCategory.status === "deleted") {
      return res.status(400).json({ error: "Category is deleted" });
    }

    await CategoryPersistence.update(result.data, {
      where: { id },
    });
    res.status(200).json({ message: "Category updated successfully" });
    return;
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
    return;
  }
};
