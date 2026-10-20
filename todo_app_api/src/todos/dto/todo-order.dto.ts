import { ArrayNotEmpty, ArrayUnique, IsArray, IsInt } from "class-validator";

export class TodoOrderDto {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsInt({ each: true })
  ids: number[];
}
