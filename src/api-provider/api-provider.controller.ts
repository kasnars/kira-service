import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiProviderService } from './api-provider.service';
import { CreateApiProviderDto } from './dto/create-api-provider.dto';
import { UpdateApiProviderDto } from './dto/update-api-provider.dto';

@ApiTags('API 供应商管理')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api-providers')
export class ApiProviderController {
  constructor(private readonly providerService: ApiProviderService) {}

  @Post()
  @ApiOperation({ summary: '创建供应商' })
  create(@Request() req: any, @Body() dto: CreateApiProviderDto) {
    return this.providerService.create(req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: '获取当前用户的所有供应商' })
  findAll(@Request() req: any) {
    return this.providerService.findAllByUser(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取单个供应商详情' })
  @ApiParam({ name: 'id', description: '供应商 ID' })
  findOne(@Param('id') id: number, @Request() req: any) {
    return this.providerService.findOne(id, req.user.id);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新供应商名称' })
  @ApiParam({ name: 'id', description: '供应商 ID' })
  update(
    @Param('id') id: number,
    @Request() req: any,
    @Body() dto: UpdateApiProviderDto,
  ) {
    return this.providerService.update(id, req.user.id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除供应商（级联删除所有 Key）' })
  @ApiParam({ name: 'id', description: '供应商 ID' })
  remove(@Param('id') id: number, @Request() req: any) {
    return this.providerService.remove(id, req.user.id);
  }
}
