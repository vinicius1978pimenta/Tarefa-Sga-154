import { IsString, IsBoolean, IsDateString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCrudDto {
  @IsString()
  
  title: string;

  @IsBoolean()
  completed: boolean;

  @IsString()
  category: string;
  
  @IsOptional()
  @IsDateString()
  dueDate: string;
}
