// 导入 Injectable 装饰器，让此类可被注入到 Controller 中
import { Injectable } from '@nestjs/common';
// 导入 InjectRepository 装饰器，用于注入 TypeORM 的 Repository
import { InjectRepository } from '@nestjs/typeorm';
// 导入 Repository 类型，这是 TypeORM 提供的数据库操作对象
import { Repository } from 'typeorm';
// 导入 User 实体类，对应数据库 users 表
import { User } from './user.entity';
// 导入创建用户的 DTO，定义创建时的参数格式
import { CreateUserDto } from './dto/create-user.dto';
// 导入更新用户的 DTO，定义更新时的参数格式
import { UpdateUserDto } from './dto/update-user.dto';
// 导入 bcrypt，用于密码加密和验证
import * as bcrypt from 'bcrypt';

// @Injectable() 标记这是一个服务类，NestJS 的依赖注入系统会管理它
@Injectable()
export class UserService {
  // 构造函数注入：通过 @InjectRepository(User) 获取 User 表的 Repository
  // Repository 是 TypeORM 提供的数据库操作对象，封装了增删改查
  // 相当于你可以用它直接对 users 表做 CRUD 操作
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  // 创建用户
  // dto 是前端传来的数据，已经经过 DTO 校验，保证字段合法
  async create(dto: CreateUserDto) {
    // 用 bcrypt 对密码进行加密（10 是加密轮数，越大越安全但越慢）
    // 明文密码不能存到数据库，这是基本安全规范
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // this.userRepo.create() 创建一个 User 实体对象
    // 注意：这一步还没有写入数据库，只是构造了一个对象
    const user = this.userRepo.create({
      ...dto,                         // 展开前端传来的 username、nickname
      password: hashedPassword,       // 用加密后的密码替换明文密码
    });

    // this.userRepo.save() 把实体对象真正保存到数据库（执行 INSERT）
    await this.userRepo.save(user);

    // 创建成功后，调用 findOne 返回用户信息（不包含密码字段）
    return this.findOne(user.id);
  }

  // 查询所有用户
  async findAll() {
    // this.userRepo.find() 查询所有记录（相当于 SELECT * FROM users）
    return this.userRepo.find({
      // select 指定返回的字段，排除 password，防止泄露
      select: { id: true, username: true, nickname: true, createdAt: true, updatedAt: true },
    });
  }

  // 根据 id 查询单个用户
  async findOne(id: number) {
    // this.userRepo.findOne() 查询一条记录（相当于 SELECT * FROM users WHERE id = ?）
    return this.userRepo.findOne({
      where: { id },                  // 查询条件：id 等于传入的值
      // 同样排除 password 字段
      select: { id: true, username: true, nickname: true, createdAt: true, updatedAt: true },
    });
  }

  // 更新用户
  // id 是要更新的用户 id，dto 是要更新的字段（可以只传部分字段）
  async update(id: number, dto: UpdateUserDto) {
    // 如果前端传了 password，需要加密后再更新
    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }
    // this.userRepo.update() 执行更新（相当于 UPDATE users SET ... WHERE id = ?）
    await this.userRepo.update(id, dto);

    // 更新完成后，返回最新的用户数据
    return this.findOne(id);
  }

  // 删除用户
  // 物理删除，数据从数据库中彻底移除
  async remove(id: number) {
    // this.userRepo.delete() 执行删除（相当于 DELETE FROM users WHERE id = ?）
    await this.userRepo.delete(id);
  }
}
