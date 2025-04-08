import { CategoryCondDTO, CategoryCondDTOSchema } from "./../../model/dto";
import { listCategoriesApi } from "./../list-api";
import { updateCategoryApi } from "./../update-api";
import { CategoryUseCase } from "../../usecase";
import { CategoryCreateDto, CategoryCreateSchema } from "../../model/dto";
import { Request, Response } from "express";
import { ICategoryUseCase } from "../../interface";
import { PagingDTOSchema } from "../../../../share/model/paging";
import { Category } from "../../model/model";
export class CategoryHttpService {
  constructor(private readonly useCase: ICategoryUseCase) {}

  async createANewCategoryApi(req: Request, res: Response): Promise<void> {
    try {
      const result = CategoryCreateSchema.safeParse(req.body);

      if (!result.success) {
        res.status(400).json({ error: result.error.errors });
        return;
      }
      const id = await this.useCase.createNewCategory(
        result.data as CategoryCreateDto
      );
      res.status(201).json({ data: id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
  }

  async getDetailCategoryAPI(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await this.useCase.getDetailCategory(id);
      res.status(200).json({ data: result });
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
  }

  async updateCategoryApi(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = CategoryCreateSchema.safeParse(req.body);

      if (!result.success) {
        res.status(400).json({ error: result.error.errors });
        return;
      }
      const check = await this.useCase.updateCategory(
        id,
        result.data as CategoryCreateDto
      );
      res.status(201).json({ data: check });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
  }

  async deleteCategoryApi(req: Request, res: Response) {
    const { id } = req.params;

    const result = await this.useCase.deleteCategory(id);
    res.status(200).json({ data: result });
  }

  async listCategoriesApi(req: Request, res: Response) {
    console.log(req.query);
    const result = PagingDTOSchema.safeParse(req.query);

    if (!result.success) {
      return res.status(400).json({ error: result.error.errors });
    }

    const condResult = CategoryCondDTOSchema.safeParse(req.query);

    if (!condResult.success) {
      return res.status(400).json({ error: condResult.error.errors });
    }

    const list = await this.useCase.getListCategories(
      condResult.data,
      result.data
    );

    const categoriesTree = this.buildTree(list);
    res.status(200).json({
      data: categoriesTree,
      paging: result.data,
      filter: condResult.data,
    });
  }

  private buildTree(categories: Category[]): Category[] {
    const categoriesTree: Category[] = [];
    const mapChildren = new Map<string, Category[]>();

    for (let i = 0; i < categories.length; i++) {
      const category = categories[i];

      if (!mapChildren.get(category.id)) {
        mapChildren.set(category.id, []);
      }

      category.children = mapChildren.get(category.id);

      if (!category.parentId) {
        categoriesTree.push(category);
      } else {
        const children = mapChildren.get(category.parentId);
        children
          ? children.push(category)
          : mapChildren.set(category.parentId, [category]);
      }
    }

    return categoriesTree;
  }
}
