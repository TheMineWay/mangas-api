import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class MangaExploreFiltersDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  name: string;

  // Pagination
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number;
}
