import { Request, Response } from "express";
import { CategoryPersistence } from "./repository/dto";
import { z } from "zod";
import { Op } from "sequelize";
import { ModelStatus } from "../../../share/model/base-model";

const PagingDTOSchema = z.object({
  page: z.coerce.number().int().positive().min(1).default(1),
  limit: z.coerce.number().int().positive().min(1).max(100).default(10),
  total: z.coerce.number().int().positive().min(0).optional(),
});

type PagingDTO = z.infer<typeof PagingDTOSchema>;

export const listCategoriesApi = async (req: Request, res: Response) => {
  const result = PagingDTOSchema.safeParse(req.query);

  if (!result.success) {
    return res.status(400).json({ error: result.error.errors });
  }
  const { page, limit } = result.data as PagingDTO;
  const cond = { status: { [Op.ne]: ModelStatus.DELETED } };
  const total = await CategoryPersistence.count({ where: cond });
  const rows = await CategoryPersistence.findAll({
    limit,
    offset: (page - 1) * limit,
    where: { status: "active" },
    order: [["created_at", "DESC"]],
  });

  res.status(200).json({ data: rows, paging: { page, limit, total } });
};
