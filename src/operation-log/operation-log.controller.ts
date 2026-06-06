import {
  Controller,
  Get,
  Delete,
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
import { OperationLogService } from './operation-log.service';
import { QueryOperationLogDto } from './dto/query-operation-log.dto';

@ApiTags('操作日志')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('operation-logs')
export class OperationLogController {
  constructor(private readonly logService: OperationLogService) {}

  @Get()
  @ApiOperation({ summary: '分页查询操作日志' })
  findAll(@Query() query: QueryOperationLogDto) {
    return this.logService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: '查询单条日志详情' })
  @ApiParam({ name: 'id', description: '日志 ID' })
  findOne(@Param('id') id: number) {
    return this.logService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除日志' })
  @ApiParam({ name: 'id', description: '日志 ID' })
  remove(@Param('id') id: number) {
    return this.logService.remove(id);
  }

  @Delete()
  @ApiOperation({ summary: '清空所有日志' })
  clear() {
    return this.logService.clear();
  }
}
