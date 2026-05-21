// 导入 Module、forwardRef 装饰器
import { Module, forwardRef } from '@nestjs/common';
// 导入 Passport 和 JWT 模块
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
// 导入用户模块，登录时需要查询用户数据
import { UserModule } from '../user/user.module';
// 导入 JWT 策略（验证 token 是否合法）
import { JwtStrategy } from './jwt.strategy';
// 导入认证控制器和服务
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

// @Module 装饰器声明认证模块
@Module({
  imports: [
    // PassportModule 注册 passport 到 NestJS 中
    PassportModule.register({ defaultStrategy: 'jwt' }),

    // JwtModule 配置 JWT 生成和验证
    // 因为 AppModule 中 ConfigModule.forRoot({ isGlobal: true }) 最先加载
    // .env 文件已被读取，process.env.JWT_SECRET 已经存在
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default-secret-change-in-production',
      signOptions: { expiresIn: '24h' },
    }),

    // 引入 UserModule，登录时需要查询用户数据
    forwardRef(() => UserModule),
  ],

  providers: [JwtStrategy, AuthService],
  controllers: [AuthController],
  exports: [PassportModule, JwtModule],
})
export class AuthModule {}
