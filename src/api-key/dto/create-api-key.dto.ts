import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateApiKeyDto {
  @ApiProperty({ description: '供应商 ID', example: 1 })
  @IsNotEmpty({ message: '供应商 ID 不能为空' })
  @IsNumber({}, { message: '供应商 ID 必须是数字' })
  provider_id: number;

  @ApiProperty({ description: 'API 名称', example: 'gpt-4' })
  @IsNotEmpty({ message: 'API 名称不能为空' })
  @IsString({ message: 'API 名称必须是字符串' })
  name: string;

  @ApiProperty({ description: 'API Key', example: 'sk-xxx' })
  @IsNotEmpty({ message: 'API Key 不能为空' })
  @IsString({ message: 'API Key 必须是字符串' })
  key: string;
}
