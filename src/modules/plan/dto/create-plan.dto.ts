import { COMType } from "prisma/generated";
import { IsEnum, IsBoolean, IsInt, IsOptional } from 'class-validator';

export class CreatePlanDto {

  @IsEnum(COMType)
  type: COMType;

  @IsInt()
  per_video: number;

  @IsBoolean()
  unlimited_videos: boolean;

  @IsBoolean()
  branding: boolean;

  @IsBoolean()
  custom_thumbnail: boolean;

  @IsInt()
  seo_optimization: number;
}