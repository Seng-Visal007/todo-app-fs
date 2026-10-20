import { ArrayNotEmpty, ArrayUnique, IsArray, IsIn, IsInt } from "class-validator";

export class BulkTodoStatusDto {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsInt({ each: true })
  ids: number[];

  @IsIn(["TODO", "IN_PROGRESS", "DONE"])
  status: string;
}
