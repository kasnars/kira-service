import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@ApiTags('角色管理')
@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @ApiOperation({ summary: '创建角色' })
  create(@Body() dto: CreateRoleDto) {
    return this.roleService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: '查询所有角色列表' })
  findAll() {
    return this.roleService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '根据 ID 查询单个角色' })
  @ApiParam({ name: 'id', description: '角色 ID' })
  findOne(@Param('id') id: number) {
    return this.roleService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新角色' })
  @ApiParam({ name: 'id', description: '角色 ID' })
  update(@Param('id') id: number, @Body() dto: UpdateRoleDto) {
    return this.roleService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除角色' })
  @ApiParam({ name: 'id', description: '角色 ID' })
  remove(@Param('id') id: number) {
    return this.roleService.remove(id);
  }

  @Put(':id/permissions')
  @ApiOperation({ summary: '设置角色权限（批量替换）' })
  @ApiParam({ name: 'id', description: '角色 ID' })
  updatePermissions(
    @Param('id') id: number,
    @Body('permission_ids') permissionIds: number[],
  ) {
    return this.roleService.updatePermissions(id, permissionIds);
  }
}
