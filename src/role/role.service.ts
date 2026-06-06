import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Role } from './role.entity';
import { PermissionService } from '../permission/permission.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
    private readonly permissionService: PermissionService,
  ) {}

  async create(dto: CreateRoleDto) {
    const existing = await this.roleRepo.findOne({ where: { name: dto.name } });
    if (existing) {
      throw new ConflictException('角色标识已存在');
    }

    const role = this.roleRepo.create({
      name: dto.name,
      label: dto.label,
      description: dto.description,
      is_default: dto.is_default ?? false,
    });

    if (dto.permission_ids?.length) {
      role.permissions = await this.permissionService.findByIds(
        dto.permission_ids,
      );
    }

    return this.roleRepo.save(role);
  }

  findAll() {
    return this.roleRepo.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number) {
    const role = await this.roleRepo.findOne({ where: { id } });
    if (!role) {
      throw new NotFoundException('角色不存在');
    }
    return role;
  }

  async findDefault() {
    const role = await this.roleRepo.findOne({ where: { is_default: true } });
    if (!role) {
      throw new NotFoundException('未配置默认角色');
    }
    return role;
  }

  async update(id: number, dto: UpdateRoleDto) {
    const role = await this.findOne(id);

    if (dto.name && dto.name !== role.name) {
      const existing = await this.roleRepo.findOne({
        where: { name: dto.name },
      });
      if (existing) {
        throw new ConflictException('角色标识已存在');
      }
    }

    if (dto.name !== undefined) role.name = dto.name;
    if (dto.label !== undefined) role.label = dto.label;
    if (dto.description !== undefined) role.description = dto.description;
    if (dto.is_default !== undefined) role.is_default = dto.is_default;

    if (dto.permission_ids !== undefined) {
      role.permissions = await this.permissionService.findByIds(
        dto.permission_ids,
      );
    }

    return this.roleRepo.save(role);
  }

  async remove(id: number) {
    const role = await this.findOne(id);
    if (role.is_default) {
      throw new BadRequestException('不能删除默认角色');
    }
    await this.roleRepo.delete(id);
    return { message: '删除成功' };
  }

  async updatePermissions(id: number, permissionIds: number[]) {
    const role = await this.findOne(id);
    role.permissions = await this.permissionService.findByIds(permissionIds);
    return this.roleRepo.save(role);
  }

  async findByIds(ids: number[]) {
    return this.roleRepo.find({ where: { id: In(ids) } });
  }
}
