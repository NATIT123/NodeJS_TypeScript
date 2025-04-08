import { IBrandQueryRepository, ICategoryQueryRepository, IProductUseCase } from "@modules/product/interface";
import { ProductCondDTO, ProductCreateDTO, ProductUpdateDTO } from "@modules/product/model/dto";
import { Product } from "@modules/product/model/product";
import { BaseHttpService } from "@share/transport/http-server";
import { Request, Response } from "express";

export class ProductHTTPService extends BaseHttpService<Product, ProductCreateDTO, ProductUpdateDTO, ProductCondDTO> {
  constructor(
    useCase: IProductUseCase, 
    private readonly productBrandRepository: IBrandQueryRepository,
    private readonly productCategoryRepository: ICategoryQueryRepository
  ) {
    super(useCase);
  }

  async getDetailAPI(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const result = await this.useCase.getDetail(id);

      const brand = await this.productBrandRepository.get(result!.brandId!);
      
      if (brand) {
        result!.brand = brand!;
      }

      const category = await this.productCategoryRepository.get(result!.categoryId!);
      
      if (category) {
        result!.category = category!;
      }
      
      res.status(200).json({ data: result });
    } catch (error) {
      res.status(400).json({
        message: (error as Error).message,
      });
    }
  }
}

