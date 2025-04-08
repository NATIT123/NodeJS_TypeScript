import { z } from "zod";

import { ModelStatus } from "../../../share/model/base-model";

export const CategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  image: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  position: z.number().min(0, "invalid position").default(0),
  parentId: z.string().uuid().nullable().optional(),
  status: z.nativeEnum(ModelStatus),
  createdAt: z.date().optional().nullable(),
  updatedAt: z.date().optional().nullable(),
});

export type Category = z.infer<typeof CategorySchema> & {
  children?: Category[];
};
