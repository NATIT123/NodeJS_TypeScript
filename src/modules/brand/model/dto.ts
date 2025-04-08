import { z } from "zod";
import { ModelStatus } from "../../../share/model/base-model";
import { ErrBrandNameTooShort } from "./errors";
import { ErrCategoryNameTooShort } from "../../category/model/errors";
export const BrandCreateSchema = z.object({
  name: z
    .string()
    .min(3, ErrBrandNameTooShort.message)
    .max(255, "name is too long"),
  image: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  tagLine: z.string().optional().nullable(),
});

export type BrandCreateDto = z.infer<typeof BrandCreateSchema>;

export const BrandUpdateSchema = z.object({
  name: z
    .string()
    .min(3, ErrCategoryNameTooShort.message)
    .max(255, "name is too long")
    .optional(),
  image: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  position: z.number().optional(),
  tagLine: z.string().optional(),
  status: z.nativeEnum(ModelStatus).optional(),
});

export type BrandUpdateDto = z.infer<typeof BrandUpdateSchema>;

export const BrandCondDTOSchema = z.object({
  name: z
    .string()
    .min(3, "name is required")
    .max(255, "name is too long")
    .optional(),
  status: z.nativeEnum(ModelStatus).optional(),
});

export type BrandCondDTO = z.infer<typeof BrandCondDTOSchema>;
