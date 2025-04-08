import { IQueryRepository } from "../../../share/interface";
import { ErrDataNotFound } from "../../../share/model/base-error";
import { BrandCondDTO } from "../model/dto";
import { Brand } from "../model/model";
import { GetDetailQuery } from "./../interface/index";
import { IQueryHandler } from "../../../share/interface";
export class GetBrandDetailQuery
  implements IQueryHandler<GetDetailQuery, Brand>
{
  constructor(
    private readonly repository: IQueryRepository<Brand, BrandCondDTO>
  ) {}
  async query(query: GetDetailQuery): Promise<Brand> {
    const data = await this.repository.get(query.id);

    if (!data) {
      throw ErrDataNotFound;
    }
    return data;
  }
}
