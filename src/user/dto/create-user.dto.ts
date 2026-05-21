// 从 class-validator 导入校验装饰器
// class-validator 是 NestJS 推荐的参数校验库，通过装饰器声明校验规则
import { IsNotEmpty, IsString, MinLength } from 'class-validator';
// 从 Swagger 导入属性描述装饰器，用于在文档中说明每个字段的含义
import { ApiProperty } from '@nestjs/swagger';

// DTO（Data Transfer Object）= 数据传输对象
// 作用：定义前端传过来的数据应该长什么样，有哪些字段，什么类型，什么规则
// 相当于前端写一个 TypeScript 接口，但这里多了运行时的校验功能
export class CreateUserDto {
  // @ApiProperty() 在 Swagger 文档中描述这个字段的含义和示例值
  @ApiProperty({ description: '用户账号', example: 'admin' })
  // @IsNotEmpty() 如果这个字段为空或缺失，返回 400 错误 + 自定义提示
  @IsNotEmpty({ message: '账号不能为空' })
  // @IsString() 如果不是字符串类型，返回 400 错误
  @IsString({ message: '账号必须是字符串' })
  username: string;

  @ApiProperty({ description: '用户密码（至少 6 位）', example: '123456' })
  // @IsNotEmpty() 密码不能为空
  @IsNotEmpty({ message: '密码不能为空' })
  // @MinLength(6) 密码长度至少 6 个字符
  @MinLength(6, { message: '密码至少 6 位' })
  password: string;

  @ApiProperty({ description: '用户昵称', example: '管理员' })
  // @IsNotEmpty() 昵称不能为空
  @IsNotEmpty({ message: '昵称不能为空' })
  // @IsString() 昵称必须是字符串
  @IsString({ message: '昵称必须是字符串' })
  nickname: string;
}
