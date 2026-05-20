// 导入 NestJS 模块装饰器
import { Module } from '@nestjs/common';
// 导入 TypeOrmModule，用于注册 Entity 到数据库
import { TypeOrmModule } from '@nestjs/typeorm';
// 导入用户实体类，对应数据库 users 表
import { User } from './user.entity';
// 导入用户控制器，处理 /users 相关的 HTTP 请求
import { UserController } from './user.controller';
// 导入用户服务，处理用户相关的业务逻辑
import { UserService } from './user.service';

// @Module 装饰器：把 User 相关的 Controller、Service、Entity 组织成一个模块
@Module({
  // imports: 导入 TypeORM 功能，forFeature([User]) 表示在这个模块中注册 User 实体
  // 这样 UserService 中才能通过 @InjectRepository(User) 注入 Repository
  imports: [TypeOrmModule.forFeature([User])],

  // controllers: 注册用户控制器，让 /users 路由生效
  controllers: [UserController],

  // providers: 注册用户服务，让它可被注入使用
  providers: [UserService],

  // exports: 导出 UserService，其他模块（比如后面的 Auth 模块）可以通过导入 UserModule 来使用 UserService
  exports: [UserService],
})
export class UserModule {}
