// Passport 的 JWT 策略：验证请求头中的 Bearer Token 是否合法
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

// @Injectable() 让此类可被注入到 Controller/Service 中
// PassportStrategy(Strategy, 'jwt') 声明这是一个 JWT 验证策略
// 第二个参数 'jwt' 是策略名称，后面 Guard 中会用到
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  // constructor 配置 JWT 验证规则
  // 因为 AppModule 中 ConfigModule.forRoot() 已先加载，.env 已读取
  // 所以 process.env.JWT_SECRET 在 AuthModule 初始化时就已经存在
  constructor() {
    super({
      // ExtractJwt.fromAuthHeaderAsBearerToken() 从请求头 Authorization: Bearer xxx 中提取 token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // secretOrKey 是用于验证 token 签名的密钥，必须和 JwtModule 生成 token 时用的完全一致
      secretOrKey: process.env.JWT_SECRET || 'default-secret-change-in-production',
    });
  }

  // validate 方法：token 验证通过后自动调用
  // payload 是 token 中携带的数据（生成时写入的用户信息）
  // 返回值会被附加到 Request 对象上，通过 req.user 访问
  validate(payload: any) {
    return {
      id: payload.id,
      username: payload.username,
    };
  }
}
