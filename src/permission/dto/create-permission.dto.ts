import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePermissionDto {
  @ApiProperty({ description: '权限标识', example: 'user:create' })
  @IsNotEmpty({ message: '权限标识不能为空' })
  @IsString({ message: '权限标识必须是字符串' })
  name: string;

  @ApiProperty({ description: '权限名称', example: '创建用户' })
  @IsNotEmpty({ message: '权限名称不能为空' })
  @IsString({ message: '权限名称必须是字符串' })
  label: string;

  @ApiProperty({ description: '所属模块', example: 'user' })
  @IsNotEmpty({ message: '所属模块不能为空' })
  @IsString({ message: '所属模块必须是字符串' })
  module: string;

  @ApiPropertyOptional({ description: '权限描述', example: '允许创建新用户' })
  @IsOptional()
  @IsString({ message: '描述必须是字符串' })
  description?: string;
}
