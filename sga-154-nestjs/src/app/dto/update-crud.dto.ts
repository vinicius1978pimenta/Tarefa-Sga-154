import { CreateCrudDto } from "./create-crud.dto";
import { PartialType } from "@nestjs/mapped-types";

export class UpdateCrudDto extends PartialType(CreateCrudDto) {
  
}