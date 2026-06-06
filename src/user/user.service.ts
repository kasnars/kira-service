import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RoleService } from '../role/role.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly roleService: RoleService,
  ) {}

  async create(dto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = this.userRepo.create({
      ...dto,
      password: hashedPassword,
    });

    const defaultRole = await this.roleService.findDefault();
    user.roles = [defaultRole];

    await this.userRepo.save(user);
    return this.findOne(user.id);
  }

  async findAll() {
    return this.userRepo.find({
      select: {
        id: true,
        username: true,
        nickname: true,
        createdAt: true,
        updatedAt: true,
      },
      relations: { roles: true },
    });
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOne({
      where: { id },
      select: {
        id: true,
        username: true,
        nickname: true,
        createdAt: true,
        updatedAt: true,
      },
      relations: { roles: true },
    });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    return user;
  }

  async findOneWithPassword(username: string) {
    return this.userRepo.findOne({
      where: { username },
      select: { id: true, username: true, password: true, nickname: true },
      relations: { roles: { permissions: true } },
    });
  }

  async findByIdWithoutPassword(id: number) {
    return this.userRepo.findOne({
      where: { id },
      select: {
        id: true,
        username: true,
        nickname: true,
        createdAt: true,
        updatedAt: true,
      },
      relations: { roles: { permissions: true } },
    });
  }

  async update(id: number, dto: UpdateUserDto) {
    await this.findOne(id);
    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }
    await this.userRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.userRepo.delete(id);
  }

  async assignRoles(userId: number, roleIds: number[]) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: { roles: true },
    });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    user.roles = await this.roleService.findByIds(roleIds);
    await this.userRepo.save(user);
    return this.findOne(userId);
  }

  async addRole(userId: number, roleId: number) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: { roles: true },
    });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    const role = await this.roleService.findOne(roleId);
    const exists = user.roles.some((r) => r.id === roleId);
    if (!exists) {
      user.roles.push(role);
      await this.userRepo.save(user);
    }
    return this.findOne(userId);
  }

  async removeRole(userId: number, roleId: number) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: { roles: true },
    });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    user.roles = user.roles.filter((r) => r.id !== roleId);
    await this.userRepo.save(user);
    return this.findOne(userId);
  }

  async getUserRoles(userId: number) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: { roles: true },
    });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    return user.roles;
  }

  async getUserPermissions(userId: number) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: { roles: { permissions: true } },
    });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    const permissions = new Map<
      number,
      { id: number; name: string; label: string; module: string }
    >();
    for (const role of user.roles) {
      for (const permission of role.permissions) {
        permissions.set(permission.id, permission);
      }
    }
    return Array.from(permissions.values());
  }
}
