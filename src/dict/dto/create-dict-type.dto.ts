import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDictTypeDto {
  @ApiProperty({ description: '类型标识', example: 'gender' })
  @IsNotEmpty({ message: '类型标识不能为空' })
  @IsString({ message: '类型标识必须是字符串' })
  name: string;

  @ApiProperty({ description: '类型名称', example: '性别' })
  @IsNotEmpty({ message: '类型名称不能为空' })
  @IsString({ message: '类型名称必须是字符串' })
  label: string;

  @ApiPropertyOptional({ description: '描述' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: '状态（1=启用，0=禁用）', example: 1 })
  @IsOptional()
  @IsNumber()
  status?: number;
}
