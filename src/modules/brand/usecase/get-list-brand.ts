import { IQueryRepository } from "../../../share/interface";
import { ErrDataNotFound } from "../../../share/model/base-error";
import { BrandCondDTO } from "../model/dto";
import { Brand } from "../model/model";
import { ListQuery } from "./../interface/index";
import { IQueryHandler } from "../../../share/interface";
export class GetListBrandQuery implements IQueryHandler<ListQuery, Brand[]> {
  constructor(
    private readonly repository: IQueryRepository<Brand, BrandCondDTO>
  ) {}
  async query(query: ListQuery): Promise<Brand[]> {
    const data = await this.repository.list(query.cond, query.paging);

    return data;
  }
}
