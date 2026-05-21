// 导入 Injectable 装饰器，让此类可被注入
import { Injectable, UnauthorizedException } from '@nestjs/common';
// 导入 JWT Service，用于生成和解析 token
import { JwtService } from '@nestjs/jwt';
// 导入用户服务，登录时需要查询数据库验证用户是否存在
import { UserService } from '../user/user.service';
// 导入密码比对工具
import * as bcrypt from 'bcrypt';

// @Injectable() 标记这是一个服务类，可被 Controller 注入使用
@Injectable()
export class AuthService {
  // 构造函数注入：UserService（查用户） + JwtService（生成 token）
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  // 登录：验证账号密码，成功后返回 token
  async login(username: string, password: string) {
    // 1. 根据 username 从数据库查询用户（需要查密码字段来比对）
    // findOneWithPassword 会返回包含密码的完整用户数据
    const user = await this.userService.findOneWithPassword(username);

    // 2. 用户不存在 → 抛出 401 未授权错误
    if (!user) {
      throw new UnauthorizedException('账号或密码错误');
    }

    // 3. bcrypt.compare 把前端传来的明文密码和数据库中的哈希值比对
    // 注意：不能直接比较字符串，因为密码存的是加密后的哈希
    const passwordMatch = await bcrypt.compare(password, user.password);

    // 4. 密码不匹配 → 同样抛出 401 错误
    if (!passwordMatch) {
      throw new UnauthorizedException('账号或密码错误');
    }

    // 5. 验证通过，生成 JWT token
    // jwtService.sign() 把用户信息编码并签名，生成一个字符串
    // 这个 token 前端后续请求都带上，后端通过它识别用户身份
    const token = this.jwtService.sign({
      id: user.id,          // 用户 ID 写入 token，后面通过 token 就能知道是哪个用户
      username: user.username, // 用户名也写入，方便调试
    });

    // 6. 返回 token 和用户基本信息（前端拿到后存在 localStorage/cookie 中）
    return {
      token,                // JWT 令牌，后续所有请求都放在 Authorization: Bearer xxx
      user: {
        id: user.id,
        username: user.username,
        nickname: user.nickname,
      },
    };
  }

  // 退出登录
  // JWT 是无状态的，服务端不需要存 session
  // 所以退出逻辑由前端删除本地 token 即可，这里只返回成功状态
  logout() {
    // 如果需要主动让 token 失效（比如加入黑名单），可以用 Redis 实现
    // 目前简单实现：前端删除 token 就算退出
    return { message: '退出登录成功' };
  }

  // 通过 token 获取当前用户信息
  // payload 是从 JWT 策略中注入到 request.user 的数据（见 jwt.strategy.ts）
  async getProfile(payload: { id: number; username: string }) {
    // 通过 token 中的 id 查询数据库获取完整用户信息
    return this.userService.findByIdWithoutPassword(payload.id);
  }
}
