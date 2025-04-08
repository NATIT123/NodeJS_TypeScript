import { ZodError } from "zod";
import { CreateCommand} from "../interface";
import { ICommandHandler } from "../../../share/interface";
import { IBrandRepository } from "../interface";
import { BrandCreateSchema } from "../model/dto";
import { Brand } from "../model/model";
import { ErrBrandNameDuplicate, ErrBrandNameTooShort } from "../model/errors";
import { v7 } from "uuid";
import { ModelStatus } from "../../../share/model/base-model";
export class CreateNewBrandHandler
  implements ICommandHandler<CreateCommand, string>
{
  constructor(private readonly repository: IBrandRepository) {}
  async excute(command: CreateCommand): Promise<string> {
    const {
      success,
      data: paresedData,
      error,
    } = BrandCreateSchema.safeParse(command.cmd);

    if (error) {
      const issues = (error as ZodError).issues;

      for (const issue of issues) {
        if (issue.path[0] === "name") {
          throw ErrBrandNameTooShort;
        }
      }
    }

    const isExist = await this.repository.findByCond({
      name: paresedData?.name,
    });

    if (isExist) {
      throw ErrBrandNameDuplicate;
    }

    const newId = v7();
    const brand: Brand = {
      id: newId,
      name: paresedData!.name,
      image: paresedData!.image,
      tagLine: paresedData!.tagLine,
      description: paresedData!.description,
      status: ModelStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.repository.insert(brand);

    return newId;
  }
}
