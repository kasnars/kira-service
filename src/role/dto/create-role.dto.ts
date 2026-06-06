import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  IsNumber,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({ description: '角色标识', example: 'editor' })
  @IsNotEmpty({ message: '角色标识不能为空' })
  @IsString({ message: '角色标识必须是字符串' })
  name: string;

  @ApiProperty({ description: '角色名称', example: '编辑者' })
  @IsNotEmpty({ message: '角色名称不能为空' })
  @IsString({ message: '角色名称必须是字符串' })
  label: string;

  @ApiPropertyOptional({ description: '角色描述', example: '内容编辑者' })
  @IsOptional()
  @IsString({ message: '描述必须是字符串' })
  description?: string;

  @ApiPropertyOptional({ description: '是否为默认角色', example: false })
  @IsOptional()
  @IsBoolean({ message: '是否默认角色必须是布尔值' })
  is_default?: boolean;

  @ApiPropertyOptional({ description: '权限 ID 列表', example: [1, 2, 3] })
  @IsOptional()
  @IsArray({ message: '权限 ID 必须是数组' })
  @IsNumber({}, { each: true, message: '权限 ID 必须是数字' })
  permission_ids?: number[];
}
