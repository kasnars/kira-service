import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DictService } from './dict.service';
import { CreateDictTypeDto } from './dto/create-dict-type.dto';
import { UpdateDictTypeDto } from './dto/update-dict-type.dto';
import { CreateDictItemDto } from './dto/create-dict-item.dto';
import { UpdateDictItemDto } from './dto/update-dict-item.dto';

@ApiTags('数据字典')
@Controller('dict')
export class DictController {
  constructor(private readonly dictService: DictService) {}

  @Post('types')
  @ApiOperation({ summary: '创建字典类型' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  createType(@Body() dto: CreateDictTypeDto) {
    return this.dictService.createType(dto);
  }

  @Get('types')
  @ApiOperation({ summary: '查询所有字典类型' })
  findAllTypes() {
    return this.dictService.findAllTypes();
  }

  @Get('types/:id')
  @ApiOperation({ summary: '查询单个字典类型（含字典项）' })
  @ApiParam({ name: 'id', description: '字典类型 ID' })
  findTypeById(@Param('id') id: number) {
    return this.dictService.findTypeById(id);
  }

  @Get('types/name/:name')
  @ApiOperation({ summary: '根据类型名称查询字典项（前端用）' })
  @ApiParam({ name: 'name', description: '字典类型标识' })
  findTypeByName(@Param('name') name: string) {
    return this.dictService.findTypeByName(name);
  }

  @Put('types/:id')
  @ApiOperation({ summary: '更新字典类型' })
  @ApiParam({ name: 'id', description: '字典类型 ID' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  updateType(@Param('id') id: number, @Body() dto: UpdateDictTypeDto) {
    return this.dictService.updateType(id, dto);
  }

  @Delete('types/:id')
  @ApiOperation({ summary: '删除字典类型（级联删除字典项）' })
  @ApiParam({ name: 'id', description: '字典类型 ID' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  removeType(@Param('id') id: number) {
    return this.dictService.removeType(id);
  }

  @Post('items')
  @ApiOperation({ summary: '创建字典项' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  createItem(@Body() dto: CreateDictItemDto) {
    return this.dictService.createItem(dto);
  }

  @Get('items')
  @ApiOperation({ summary: '查询字典项列表' })
  findItems(
    @Query('type_id') typeId?: number,
    @Query('type_name') typeName?: string,
  ) {
    if (typeName) {
      return this.dictService.findItemsByTypeName(typeName);
    }
    if (typeId) {
      return this.dictService.findItemsByTypeId(typeId);
    }
    return [];
  }

  @Put('items/:id')
  @ApiOperation({ summary: '更新字典项' })
  @ApiParam({ name: 'id', description: '字典项 ID' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  updateItem(@Param('id') id: number, @Body() dto: UpdateDictItemDto) {
    return this.dictService.updateItem(id, dto);
  }

  @Delete('items/:id')
  @ApiOperation({ summary: '删除字典项' })
  @ApiParam({ name: 'id', description: '字典项 ID' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  removeItem(@Param('id') id: number) {
    return this.dictService.removeItem(id);
  }
}
