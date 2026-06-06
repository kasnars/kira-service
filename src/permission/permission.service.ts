import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Permission } from './permission.entity';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepo: Repository<Permission>,
  ) {}

  async create(dto: CreatePermissionDto) {
    const existing = await this.permissionRepo.findOne({
      where: { name: dto.name },
    });
    if (existing) {
      throw new ConflictException('权限标识已存在');
    }
    const permission = this.permissionRepo.create(dto);
    return this.permissionRepo.save(permission);
  }

  findAll() {
    return this.permissionRepo.find({ order: { module: 'ASC', id: 'ASC' } });
  }

  async findOne(id: number) {
    const permission = await this.permissionRepo.findOne({ where: { id } });
    if (!permission) {
      throw new NotFoundException('权限不存在');
    }
    return permission;
  }

  async update(id: number, dto: UpdatePermissionDto) {
    await this.findOne(id);
    if (dto.name) {
      const existing = await this.permissionRepo.findOne({
        where: { name: dto.name },
      });
      if (existing && existing.id !== id) {
        throw new ConflictException('权限标识已存在');
      }
    }
    await this.permissionRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.permissionRepo.delete(id);
    return { message: '删除成功' };
  }

  async findByIds(ids: number[]) {
    return this.permissionRepo.find({ where: { id: In(ids) } });
  }
}
