import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDictItemDto {
  @ApiProperty({ description: '字典类型 ID', example: 1 })
  @IsNotEmpty({ message: '字典类型 ID 不能为空' })
  @IsNumber({}, { message: '字典类型 ID 必须是数字' })
  type_id: number;

  @ApiProperty({ description: '显示名称', example: '男' })
  @IsNotEmpty({ message: '显示名称不能为空' })
  @IsString({ message: '显示名称必须是字符串' })
  label: string;

  @ApiProperty({ description: '值', example: 'male' })
  @IsNotEmpty({ message: '值不能为空' })
  @IsString({ message: '值必须是字符串' })
  value: string;

  @ApiPropertyOptional({ description: '排序号', example: 0 })
  @IsOptional()
  @IsNumber()
  sort?: number;

  @ApiPropertyOptional({ description: '状态（1=启用，0=禁用）', example: 1 })
  @IsOptional()
  @IsNumber()
  status?: number;

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  remark?: string;
}
