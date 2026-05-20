// 导入 NestJS 模块装饰器
import { Module } from '@nestjs/common';
// 导入配置模块，用于读取 .env 环境变量
import { ConfigModule, ConfigService } from '@nestjs/config';
// 导入 TypeORM 模块，用于数据库连接
import { TypeOrmModule } from '@nestjs/typeorm';
// 导入默认的控制器和服务
import { AppController } from './app.controller';
import { AppService } from './app.service';
// 导入用户模块
import { UserModule } from './user/user.module';

// @Module 装饰器：声明这是一个 NestJS 模块
// NestJS 的应用就是由多个 Module 组成的
@Module({
  // imports: 引入其他模块，类似 Vue 的 components
  imports: [
    // ConfigModule.forRoot 初始化配置模块，能自动读取 .env 文件
    ConfigModule.forRoot({
      // isGlobal: true 表示在所有模块中都能使用配置，不用重复引入
      isGlobal: true,
    }),

    // TypeOrmModule.forRootAsync 异步配置数据库连接（因为需要读取环境变量）
    TypeOrmModule.forRootAsync({
      // inject 告诉 NestJS 这个工厂函数需要注入 ConfigService
      inject: [ConfigService],
      // useFactory 工厂函数，返回数据库配置
      useFactory: (config: ConfigService) => ({
        type: 'better-sqlite3',           // 数据库类型，这里用的是 SQLite
        database: config.get('DB_DATABASE'), // 从 .env 读取数据库文件路径
        autoLoadEntities: true,           // 自动加载所有 Entity（不用手动注册每个实体）
        synchronize: true,                // 开发环境：Entity 改动后自动同步表结构
                                          // 生产环境必须改为 false，否则每次启动都会改表！
      }),
    }),

    // 注册用户模块，注册后 /users 路由才会生效
    UserModule,
  ],

  // controllers: 注册控制器，处理 HTTP 请求
  controllers: [AppController],

  // providers: 注册服务（业务逻辑层），可被其他模块注入使用
  providers: [AppService],
})
// 导出 AppModule 类，main.ts 会 import 它来启动应用
export class AppModule {}
