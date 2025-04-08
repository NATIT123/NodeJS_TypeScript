import { Request, Response } from "express";
import { CategoryPersistence } from "./repository/dto";
import { ModelStatus } from "../../../share/model/base-model";
export const deleteCategoryApi = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const currentCategory = await CategoryPersistence.findByPk(id);

    if (!currentCategory) {
      return res.status(404).json({ error: "Category not found" });
    }

    if (currentCategory.status === "deleted") {
      return res.status(400).json({ error: "Category is deleted" });
    }

    await CategoryPersistence.update(
      { status: ModelStatus.DELETED },
      {
        where: { id },
      }
    );
    res.status(200).json({ message: "Category deleted successfully" });
    return;
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
    return;
  }
};
