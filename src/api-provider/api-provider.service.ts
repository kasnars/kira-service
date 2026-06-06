import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiProvider } from './api-provider.entity';
import { CreateApiProviderDto } from './dto/create-api-provider.dto';
import { UpdateApiProviderDto } from './dto/update-api-provider.dto';

@Injectable()
export class ApiProviderService {
  constructor(
    @InjectRepository(ApiProvider)
    private readonly providerRepo: Repository<ApiProvider>,
  ) {}

  async create(userId: number, dto: CreateApiProviderDto) {
    const provider = this.providerRepo.create({
      user_id: userId,
      name: dto.name,
    });
    return this.providerRepo.save(provider);
  }

  async findAllByUser(userId: number) {
    return this.providerRepo.find({
      where: { user_id: userId },
      relations: { api_keys: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number, userId: number) {
    const provider = await this.providerRepo.findOne({
      where: { id },
      relations: { api_keys: true },
    });
    if (!provider) {
      throw new NotFoundException('供应商不存在');
    }
    if (provider.user_id !== userId) {
      throw new ForbiddenException('无权访问该供应商');
    }
    return provider;
  }

  async update(id: number, userId: number, dto: UpdateApiProviderDto) {
    await this.findOne(id, userId);
    await this.providerRepo.update(id, { name: dto.name });
    return this.findOne(id, userId);
  }

  async remove(id: number, userId: number) {
    await this.findOne(id, userId);
    await this.providerRepo.delete(id);
    return { message: '删除成功' };
  }
}
