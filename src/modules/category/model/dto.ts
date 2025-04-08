import { z } from "zod";
import { ModelStatus } from "../../../share/model/base-model";
export const CategoryCreateSchema = z.object({
  name: z.string().min(3, "name is required").max(255, "name is too long"),
  image: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  parentId: z.string().uuid().optional().nullable(),
});

export type CategoryCreateDto = z.infer<typeof CategoryCreateSchema>;

export const CategoryUpdateSchema = z.object({
  name: z
    .string()
    .min(3, "name is required")
    .max(255, "name is too long")
    .optional(),
  image: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  position: z.number().optional(),
  parentId: z.string().uuid().optional().nullable(),
  status: z.nativeEnum(ModelStatus).optional(),
});

export type CategoryUpdateDto = z.infer<typeof CategoryUpdateSchema>;

export const CategoryCondDTOSchema = z.object({
  name: z
    .string()
    .min(3, "name is required")
    .max(255, "name is too long")
    .optional(),
  parentId: z.string().uuid().optional(),
  status: z.nativeEnum(ModelStatus).optional(),
});

export type CategoryCondDTO = z.infer<typeof CategoryCondDTOSchema>;
