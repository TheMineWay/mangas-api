import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class MangaExploreFiltersDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  name: string;

  // Pagination
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number;
}
