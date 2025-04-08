import { ZodError } from "zod";
import { CreateCommand, UpdateCommand } from "../interface";
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
export class UpdateBrandHandler
  implements ICommandHandler<UpdateCommand, void>
{
  constructor(private readonly repository: IBrandRepository) {}
  async excute(command: UpdateCommand): Promise<void> {
    const {
      success,
      data: paresedData,
      error,
    } = BrandUpdateSchema.safeParse(command.cmd);

    if (error) {
      const issues = (error as ZodError).issues;

      for (const issue of issues) {
        if (issue.path[0] === "name") {
          throw ErrBrandNameTooShort;
        }
      }
    }

    const brand = await this.repository.get(command.id);
    if (!brand || brand.status == ModelStatus.DELETED) {
      throw ErrDataNotFound;
    }

    const isExist = await this.repository.findByCond({
      name: paresedData?.name,
    });

    if (isExist) {
      throw ErrBrandNameDuplicate;
    }

    await this.repository.update(command.id, paresedData as BrandUpdateDto);
    return;
  }
}
