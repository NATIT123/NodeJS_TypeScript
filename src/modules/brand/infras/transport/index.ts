import { Request, Response } from "express";

import { PagingDTOSchema } from "../../../../share/model/paging";
import {
  BrandCondDTO,
  BrandCondDTOSchema,
  BrandCreateDto,
  BrandCreateSchema,
  BrandUpdateSchema,
} from "../../model/dto";
import {
  CreateCommand,
  DeleteCommand,
  GetDetailQuery,
  IBrandUseCase,
  ListQuery,
  UpdateCommand,
} from "../../interface";
import { ICommandHandler, IQueryHandler } from "../../../../share/interface";
import { Brand } from "../../model/model";
export class BrandHttpService {
  constructor(
    private readonly createCmdHandler: ICommandHandler<CreateCommand, string>,
    private readonly getDetailQueryHandler: IQueryHandler<
      GetDetailQuery,
      Brand
    >,
    private readonly updateCmdHandler: ICommandHandler<UpdateCommand, void>,
    private readonly deleteCmdHandler: ICommandHandler<DeleteCommand, void>,
    private readonly listQueryHandler: IQueryHandler<ListQuery, Brand[]>
  ) {}

  async createANewBrandApi(req: Request, res: Response): Promise<void> {
    try {
      const result = BrandCreateSchema.safeParse(req.body as BrandCreateDto);
      console.log(result);
      if (!result.success) {
        res.status(400).json({ error: result.error.errors });
        return;
      }
      const id = await this.createCmdHandler.excute({
        cmd: result.data as BrandCreateDto,
      });
      res.status(201).json({ data: id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
  }

  async getDetailBrandAPI(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await this.getDetailQueryHandler.query({ id });
      res.status(200).json({ data: result });
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
      return;
    }
  }

  async updateBrandApi(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = BrandUpdateSchema.safeParse(req.body);

      const cmd: UpdateCommand = { id, cmd: req.body };

      if (!result.success) {
        res.status(400).json({ error: result.error.errors });
        return;
      }
      const check = await this.updateCmdHandler.excute(cmd);
      res.status(201).json({ data: check });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
  }

  async deleteBrandApi(req: Request, res: Response) {
    const { id } = req.params;

    await this.deleteCmdHandler.excute({
      id,
      isHardDelete: false,
    });
    res.status(200).json({ data: true });
  }

  async listBrandsApi(req: Request, res: Response) {
    const result = PagingDTOSchema.safeParse(req.query);

    if (!result.success) {
      return res.status(400).json({ error: result.error.errors });
    }

    const condResult = BrandCondDTOSchema.safeParse(req.query);

    if (!condResult.success) {
      return res.status(400).json({ error: condResult.error.errors });
    }

    const list = await this.listQueryHandler.query({
      cond: condResult.data,
      paging: result.data,
    });

    res.status(200).json({
      data: list,
      paging: result.data,
      filter: condResult.data,
    });
  }
}
