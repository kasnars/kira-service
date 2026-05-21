// 导入校验装饰器和 Swagger 属性描述装饰器
import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// 登录 DTO：只需要账号和密码
export class LoginDto {
  @ApiProperty({ description: '用户账号', example: 'admin' })
  @IsNotEmpty({ message: '账号不能为空' })
  @IsString({ message: '账号必须是字符串' })
  username: string;

  @ApiProperty({ description: '用户密码', example: '123456' })
  @IsNotEmpty({ message: '密码不能为空' })
  @MinLength(6, { message: '密码至少 6 位' })
  password: string;
}
