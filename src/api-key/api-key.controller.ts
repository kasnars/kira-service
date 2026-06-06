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
import { ApiKeyService } from './api-key.service';
import { CreateApiKeyDto } from './dto/create-api-key.dto';
import { UpdateApiKeyDto } from './dto/update-api-key.dto';

@ApiTags('API Key 管理')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api-keys')
export class ApiKeyController {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  @Post()
  @ApiOperation({ summary: '创建 API Key' })
  create(@Request() req: any, @Body() dto: CreateApiKeyDto) {
    return this.apiKeyService.create(req.user.id, dto);
  }

  @Get('provider/:providerId')
  @ApiOperation({ summary: '获取某供应商下的所有 API Key' })
  @ApiParam({ name: 'providerId', description: '供应商 ID' })
  findAllByProvider(
    @Param('providerId') providerId: number,
    @Request() req: any,
  ) {
    return this.apiKeyService.findAllByProvider(providerId, req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取单个 API Key 详情' })
  @ApiParam({ name: 'id', description: 'API Key ID' })
  findOne(@Param('id') id: number, @Request() req: any) {
    return this.apiKeyService.findOne(id, req.user.id);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新 API Key' })
  @ApiParam({ name: 'id', description: 'API Key ID' })
  update(
    @Param('id') id: number,
    @Request() req: any,
    @Body() dto: UpdateApiKeyDto,
  ) {
    return this.apiKeyService.update(id, req.user.id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除 API Key' })
  @ApiParam({ name: 'id', description: 'API Key ID' })
  remove(@Param('id') id: number, @Request() req: any) {
    return this.apiKeyService.remove(id, req.user.id);
  }
}
