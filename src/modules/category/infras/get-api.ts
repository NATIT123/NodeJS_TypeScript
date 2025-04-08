import { Request, Response } from "express";
import { CategoryPersistence } from "./repository/dto";
export const getCategoryApi = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const currentCategory = await CategoryPersistence.findByPk(id);

    if (!currentCategory) {
      return res.status(404).json({ error: "Category not found" });
    }

    if (currentCategory.status === "deleted") {
      return res.status(400).json({ error: "Category is deleted" });
    }

    res.status(200).json({ data: currentCategory });
    return;
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
    return;
  }
};
