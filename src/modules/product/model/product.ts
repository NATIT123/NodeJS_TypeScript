import { ModelStatus } from "@share/model/base-model";
import { z } from "zod";
import {
  ErrBrandIdMustBeValidUUID,
  ErrCategoryIdMustBeValidUUID,
  ErrNameMustBeAtLeast2Characters,
  ErrPriceMustBePositive,
  ErrQuantityMustBeNonnegative,
  ErrSalePriceMustBeNonnegative,
} from "./error";

export enum ProductGender {
  MALE = "male",
  FEMALE = "female",
  UNISEX = "unisex",
}

export const ProductSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2, ErrNameMustBeAtLeast2Characters.message),
  gender: z.nativeEnum(ProductGender),
  images: z.array(z.string()).nullable(),
  price: z.number().positive(ErrPriceMustBePositive.message),
  salePrice: z.number().nonnegative(ErrSalePriceMustBeNonnegative.message),
  colors: z.string().optional(),
  quantity: z.number().int().nonnegative(ErrQuantityMustBeNonnegative.message),
  brandId: z.string().uuid(ErrBrandIdMustBeValidUUID.message).optional(),
  categoryId: z.string().uuid(ErrCategoryIdMustBeValidUUID.message).optional(),
  content: z.string().optional(),
  description: z.string().optional(),
  rating: z.number().min(0).max(5),
  saleCount: z.number().int().nonnegative(),
  status: z.nativeEnum(ModelStatus),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Product = z.infer<typeof ProductSchema> & {
  category?: ProductCategory;
  brand?: ProductBrand;
};

export const ProductBrandSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2, ErrNameMustBeAtLeast2Characters),
});

export type ProductBrand = z.infer<typeof ProductBrandSchema>;

export const ProductCategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2, ErrNameMustBeAtLeast2Characters),
});

export type ProductCategory = z.infer<typeof ProductCategorySchema>;
