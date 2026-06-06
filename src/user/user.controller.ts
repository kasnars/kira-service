import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('用户管理')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

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

  @Get(':id/roles')
  @ApiOperation({ summary: '获取用户的角色列表' })
  @ApiParam({ name: 'id', description: '用户 ID' })
  getUserRoles(@Param('id') id: number) {
    return this.userService.getUserRoles(id);
  }

  @Put(':id/roles')
  @ApiOperation({ summary: '批量设置用户角色（替换）' })
  @ApiParam({ name: 'id', description: '用户 ID' })
  assignRoles(@Param('id') id: number, @Body('role_ids') roleIds: number[]) {
    return this.userService.assignRoles(id, roleIds);
  }

  @Post(':id/roles/:roleId')
  @ApiOperation({ summary: '给用户添加角色' })
  @ApiParam({ name: 'id', description: '用户 ID' })
  @ApiParam({ name: 'roleId', description: '角色 ID' })
  addRole(@Param('id') id: number, @Param('roleId') roleId: number) {
    return this.userService.addRole(id, roleId);
  }

  @Delete(':id/roles/:roleId')
  @ApiOperation({ summary: '移除用户的某个角色' })
  @ApiParam({ name: 'id', description: '用户 ID' })
  @ApiParam({ name: 'roleId', description: '角色 ID' })
  removeRole(@Param('id') id: number, @Param('roleId') roleId: number) {
    return this.userService.removeRole(id, roleId);
  }

  @Get(':id/permissions')
  @ApiOperation({ summary: '获取用户的权限列表（所有角色权限的并集）' })
  @ApiParam({ name: 'id', description: '用户 ID' })
  getUserPermissions(@Param('id') id: number) {
    return this.userService.getUserPermissions(id);
  }
}
