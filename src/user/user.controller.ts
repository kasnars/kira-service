// 从 @nestjs/common 导入各种 HTTP 相关的装饰器
import {
  Controller,   // 声明此类是控制器，处理 HTTP 请求
  Get,          // 处理 GET 请求
  Post,         // 处理 POST 请求
  Put,          // 处理 PUT 请求
  Delete,       // 处理 DELETE 请求
  Body,         // 获取请求体（POST/PUT 的 JSON 数据）
  Param,        // 获取路由参数（比如 /users/:id 中的 id）
} from '@nestjs/common';
// 导入用户服务层，业务逻辑在这里处理
import { UserService } from './user.service';
// 导入创建用户的 DTO（数据传输对象），用于校验请求参数
import { CreateUserDto } from './dto/create-user.dto';
// 导入更新用户的 DTO，同样用于参数校验
import { UpdateUserDto } from './dto/update-user.dto';

// @Controller('users') 声明这个控制器处理 /users 开头的路由
// 比如 POST /users、GET /users、GET /users/1
@Controller('users')
export class UserController {
  // 构造函数注入 UserService
  // NestJS 会自动创建 UserService 实例并传入，不需要手动 new
  constructor(private readonly userService: UserService) {}

  // @Post() 处理 POST /users 请求
  // @Body() dto 自动把请求体 JSON 解析并校验后赋值给 dto
  // dto 的类型是 CreateUserDto，会自动校验字段是否合法
  @Post()
  create(@Body() dto: CreateUserDto) {
    // 调用 Service 层创建用户，返回创建后的用户数据
    return this.userService.create(dto);
  }

  // @Get() 处理 GET /users 请求，查询所有用户列表
  @Get()
  findAll() {
    // 调用 Service 层查询所有用户
    return this.userService.findAll();
  }

  // @Get(':id') 处理 GET /users/:id 请求
  // :id 是路由参数，比如访问 /users/1，id 就是 1
  @Get(':id')
  findOne(@Param('id') id: number) {
    // @Param('id') 从 URL 中取出 id 值
    // +id 是把字符串转成数字（URL 参数默认是字符串类型）
    return this.userService.findOne(+id);
  }

  // @Put(':id') 处理 PUT /users/:id 请求，更新指定用户
  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdateUserDto) {
    // 同时取路由参数 id 和请求体 dto
    return this.userService.update(id, dto);
  }

  // @Delete(':id') 处理 DELETE /users/:id 请求，删除指定用户
  @Delete(':id')
  remove(@Param('id') id: number) {
    // +id 把字符串转成数字
    return this.userService.remove(+id);
  }
}
