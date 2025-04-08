import { ZodError } from "zod";
import { DeleteCommand } from "../interface";
import { ICommandHandler } from "../../../share/interface";
import { IBrandRepository } from "../interface";
import {
  BrandCreateSchema,
  BrandUpdateDto,
  BrandUpdateSchema,
} from "../model/dto";
import { Brand } from "../model/model";
import { ErrBrandNameDuplicate, ErrBrandNameTooShort } from "../model/errors";
import { v7 } from "uuid";
import { ModelStatus } from "../../../share/model/base-model";
import { ErrDataNotFound } from "../../../share/model/base-error";
export class DeleteBrandHandler
  implements ICommandHandler<DeleteCommand, void>
{
  constructor(private readonly repository: IBrandRepository) {}
  async excute(command: DeleteCommand): Promise<void> {
    const brand = await this.repository.get(command.id);
    if (!brand || brand.status == ModelStatus.DELETED) {
      throw ErrDataNotFound;
    }

    await this.repository.delete(command.id, command.isHardDelete);
    return;
  }
}
