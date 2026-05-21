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
// 导入 Swagger 装饰器，用于生成接口文档
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
// 导入用户服务层，业务逻辑在这里处理
import { UserService } from './user.service';
// 导入创建用户的 DTO（数据传输对象），用于校验请求参数
import { CreateUserDto } from './dto/create-user.dto';
// 导入更新用户的 DTO，同样用于参数校验
import { UpdateUserDto } from './dto/update-user.dto';

// @ApiTags('用户管理') 在 Swagger 文档中把这个控制器归类到 "用户管理" 分组下
@ApiTags('用户管理')
// @Controller('users') 声明这个控制器处理 /users 开头的路由
// 比如 POST /users、GET /users、GET /users/1
@Controller('users')
export class UserController {
  // 构造函数注入 UserService
  // NestJS 会自动创建 UserService 实例并传入，不需要手动 new
  constructor(private readonly userService: UserService) {}

  // @ApiOperation() 在文档中描述这个接口的作用
  // @ApiBody() 在文档中说明请求体的结构（自动生成，因为有 DTO 类型）
  @Post()
  @ApiOperation({ summary: '创建用户' })
  @ApiBody({ type: CreateUserDto })
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: '查询所有用户列表' })
  findAll() {
    return this.userService.findAll();
  }

  // @ApiParam() 在文档中说明路由参数的类型和含义
  @Get(':id')
  @ApiOperation({ summary: '根据 ID 查询单个用户' })
  @ApiParam({ name: 'id', description: '用户 ID', type: Number })
  findOne(@Param('id') id: number) {
    return this.userService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新用户信息' })
  @ApiParam({ name: 'id', description: '用户 ID', type: Number })
  @ApiBody({ type: UpdateUserDto })
  update(@Param('id') id: number, @Body() dto: UpdateUserDto) {
    return this.userService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除用户' })
  @ApiParam({ name: 'id', description: '用户 ID', type: Number })
  remove(@Param('id') id: number) {
    return this.userService.remove(+id);
  }
}
