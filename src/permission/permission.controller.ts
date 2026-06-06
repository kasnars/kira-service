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
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@ApiTags('权限管理')
@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  @ApiOperation({ summary: '创建权限' })
  create(@Body() dto: CreatePermissionDto) {
    return this.permissionService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: '查询所有权限列表' })
  findAll() {
    return this.permissionService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '根据 ID 查询单个权限' })
  @ApiParam({ name: 'id', description: '权限 ID' })
  findOne(@Param('id') id: number) {
    return this.permissionService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新权限' })
  @ApiParam({ name: 'id', description: '权限 ID' })
  update(@Param('id') id: number, @Body() dto: UpdatePermissionDto) {
    return this.permissionService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除权限' })
  @ApiParam({ name: 'id', description: '权限 ID' })
  remove(@Param('id') id: number) {
    return this.permissionService.remove(id);
  }
}
