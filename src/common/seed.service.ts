import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../role/role.entity';
import { Permission } from '../permission/permission.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepo: Repository<Permission>,
  ) {}

  async onModuleInit() {
    await this.seedPermissions();
    await this.seedRoles();
  }

  private async seedPermissions() {
    const count = await this.permissionRepo.count();
    if (count > 0) return;

    const permissions = this.permissionRepo.create([
      { name: 'user:list', label: '查看用户列表', module: 'user' },
      { name: 'user:create', label: '创建用户', module: 'user' },
      { name: 'user:update', label: '编辑用户', module: 'user' },
      { name: 'user:delete', label: '删除用户', module: 'user' },
      { name: 'role:list', label: '查看角色列表', module: 'role' },
      { name: 'role:create', label: '创建角色', module: 'role' },
      { name: 'role:update', label: '编辑角色', module: 'role' },
      { name: 'role:delete', label: '删除角色', module: 'role' },
      { name: 'role:assign', label: '分配角色', module: 'role' },
      { name: 'permission:list', label: '查看权限列表', module: 'permission' },
      { name: 'permission:create', label: '创建权限', module: 'permission' },
      { name: 'permission:update', label: '编辑权限', module: 'permission' },
      { name: 'permission:delete', label: '删除权限', module: 'permission' },
    ]);
    await this.permissionRepo.save(permissions);
    this.logger.log('权限种子数据初始化完成');
  }

  private async seedRoles() {
    const count = await this.roleRepo.count();
    if (count > 0) return;

    const allPermissions = await this.permissionRepo.find();
    const userPermissions = allPermissions.filter(
      (p) => p.name === 'user:list',
    );

    const roles = this.roleRepo.create([
      {
        name: 'super_admin',
        label: '超级管理员',
        description: '拥有所有权限',
        is_default: false,
        permissions: allPermissions,
      },
      {
        name: 'admin',
        label: '管理员',
        description: '拥有用户和角色管理权限',
        is_default: false,
        permissions: allPermissions.filter((p) => p.module !== 'permission'),
      },
      {
        name: 'user',
        label: '普通用户',
        description: '基本用户权限',
        is_default: true,
        permissions: userPermissions,
      },
    ]);
    await this.roleRepo.save(roles);
    this.logger.log('角色种子数据初始化完成');
  }
}
