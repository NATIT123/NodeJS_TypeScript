import { PagingDTO } from "../../../share/model/paging";
import { Brand } from "../model/model";
import { BrandCondDTO, BrandCreateDto, BrandUpdateDto } from "../model/dto";
import { IRepository } from "../../../share/interface";
export interface IBrandUseCase {
  createNewBrand(data: BrandCreateDto): Promise<string>;
  getDetailBrand(id: string): Promise<Brand | null>;
  getListBrands(cond: BrandCondDTO, paging: PagingDTO): Promise<Brand[]>;
  updateBrand(id: string, data: BrandUpdateDto): Promise<boolean>;
  deleteBrand(id: string): Promise<boolean>;
}

export interface CreateCommand {
  cmd: BrandCreateDto;
}

export interface GetDetailQuery {
  id: string;
}

export interface UpdateCommand {
  id: string;
  cmd: BrandUpdateDto;
}

export interface DeleteCommand {
  id: string;
  isHardDelete: boolean;
}

export interface ListQuery {
  cond: BrandCondDTO;
  paging: PagingDTO;
}

export interface IBrandRepository
  extends IRepository<Brand, BrandCondDTO, BrandUpdateDto> {}
