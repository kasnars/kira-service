import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Like } from 'typeorm';
import { OperationLog } from './operation-log.entity';
import { QueryOperationLogDto } from './dto/query-operation-log.dto';

@Injectable()
export class OperationLogService {
  constructor(
    @InjectRepository(OperationLog)
    private readonly logRepo: Repository<OperationLog>,
  ) {}

  async create(data: Partial<OperationLog>) {
    const log = this.logRepo.create(data);
    return this.logRepo.save(log);
  }

  async findAll(query: QueryOperationLogDto) {
    const {
      page = 1,
      limit = 10,
      username,
      module,
      action,
      start_time,
      end_time,
    } = query;

    const where: Record<string, any> = {};
    if (username) where.username = Like(`%${username}%`);
    if (module) where.module = module;
    if (action) where.action = action;
    if (start_time && end_time) {
      where.createdAt = Between(new Date(start_time), new Date(end_time));
    }

    const [items, total] = await this.logRepo.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const log = await this.logRepo.findOne({ where: { id } });
    if (!log) {
      throw new NotFoundException('日志不存在');
    }
    return log;
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.logRepo.delete(id);
    return { message: '删除成功' };
  }

  async clear() {
    await this.logRepo.clear();
    return { message: '清空成功' };
  }
}
