import { z } from "zod";

import { ModelStatus } from "../../../share/model/base-model";
import { ErrBrandNameTooShort } from "./errors";
export const modelName = "brand";
export const BrandSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2, ErrBrandNameTooShort.message),
  image: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  tagLine: z.string().optional().nullable(),
  status: z.nativeEnum(ModelStatus),
  createdAt: z.date().optional().nullable(),
  updatedAt: z.date().optional().nullable(),
});

export type Brand = z.infer<typeof BrandSchema> & {};
