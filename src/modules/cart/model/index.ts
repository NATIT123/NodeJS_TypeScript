import { z } from "zod";
import { ErrQuantityMustBeNonnegative } from "./error";

export const cartProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  images: z.array(z.string()).nullable(),
  salePrice: z.preprocess((val) => Number(val), z.number()),
  price: z.preprocess((val) => Number(val), z.number()),
  quantity: z.number(),
});

// Cart item model
export const cartItemSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  productId: z.string().uuid(),
  attribute: z.string().nullable().optional().default(""),
  quantity: z.number().min(1).default(1),
  product: cartProductSchema.optional(),
  createdAt: z.date().optional().nullable(),
  updatedAt: z.date().optional().nullable(),
});

// DTOs
export const addCartItemDTOSchema = z.object({
  userId: z.string().uuid(),
  productId: z.string().uuid(),
  attribute: z.string().nullable().optional().default(""),
  quantity: z.number().min(1, ErrQuantityMustBeNonnegative.message).default(1),
});

export const cartItemCondDTOSchema = z.object({
  userId: z.string().uuid().optional(),
  productId: z.string().uuid().optional(),
  attribute: z.string().nullable().optional().default(""),
});

export const updateCartItemDTOSchema = z.object({
  userId: z.string(),
  productId: z.string(),
  attribute: z.string().nullable().optional().default(""),
  quantity: z.number(),
  updatedAt: z.date().optional().nullable(),
});

export type CartProduct = z.infer<typeof cartProductSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;

export type AddCartItemDTO = z.infer<typeof addCartItemDTOSchema>;
export type CartItemConDTO = z.infer<typeof cartItemCondDTOSchema>;
export type UpdateCartItemDTO = z.infer<typeof updateCartItemDTOSchema>;
