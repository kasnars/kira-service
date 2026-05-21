// 导入 Injectable 装饰器和 AuthGuard
import { Injectable } from '@nestjs/common';
// 导入 AuthGuard，这是 @nestjs/passport 提供的守卫基类
import { AuthGuard } from '@nestjs/passport';

// @Injectable() 让此类可被注入
// AuthGuard('jwt') 继承自 passport 的 JWT 守卫
// 作用：拦截请求，验证 Authorization: Bearer xxx 中的 token 是否合法
// 如果 token 无效或缺失，直接返回 401 错误，请求不会到达 Controller 方法
// 如果 token 合法，解析出用户信息并附加到 request.user，继续执行
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
