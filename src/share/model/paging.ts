import { z } from "zod";
export const PagingDTOSchema = z.object({
  page: z.coerce.number().int().positive().min(1).default(1),
  limit: z.coerce.number().int().positive().min(1).max(100).default(10),
  total: z.coerce.number().int().positive().min(0).optional(),
});

export type PagingDTO = z.infer<typeof PagingDTOSchema>;
