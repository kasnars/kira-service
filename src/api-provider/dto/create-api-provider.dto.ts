import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateApiProviderDto {
  @ApiProperty({ description: '供应商名称', example: 'OpenAI' })
  @IsNotEmpty({ message: '供应商名称不能为空' })
  @IsString({ message: '供应商名称必须是字符串' })
  name: string;
}
