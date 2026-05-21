// 导入 Controller、Post、Get、Body、UseGuards、Request 等 HTTP 相关装饰器
import {
  Controller,       // 声明此类处理 HTTP 请求
  Post,             // 处理 POST 请求
  Get,              // 处理 GET 请求
  Body,             // 获取请求体 JSON 数据
  UseGuards,        // 使用守卫（拦截器）保护接口
  Request,          // 获取完整的请求对象，可以取 req.user
} from '@nestjs/common';
// 导入 Swagger 装饰器，用于生成接口文档
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
// 导入 JWT 守卫，用于保护需要登录才能访问的接口
import { JwtAuthGuard } from './jwt-auth.guard';
// 导入认证服务，处理登录、退出、获取用户信息的业务逻辑
import { AuthService } from './auth.service';
// 导入登录 DTO，校验登录请求参数
import { LoginDto } from './dto/login.dto';

// @ApiTags('认证管理') 在 Swagger 文档中归类到 "认证管理" 分组
@ApiTags('认证管理')
// @Controller('auth') 所有认证相关接口都以 /auth 开头
@Controller('auth')
export class AuthController {
  // 构造函数注入 AuthService
  constructor(private readonly authService: AuthService) {}

  // POST /auth/login 用户登录接口
  @Post('login')
  @ApiOperation({ summary: '用户登录，返回 JWT token' })
  async login(@Body() dto: LoginDto) {
    // 调用 Service 层验证账号密码，成功后生成并返回 token
    return this.authService.login(dto.username, dto.password);
  }

  // POST /auth/logout 退出登录接口
  @Post('logout')
  @ApiOperation({ summary: '退出登录' })
  @UseGuards(JwtAuthGuard)    // 需要登录才能退出（防止未登录用户调用）
  @ApiBearerAuth()            // Swagger 文档中标注此接口需要 Bearer Token
  logout() {
    return this.authService.logout();
  }

  // GET /auth/profile 通过 token 获取当前用户信息
  @Get('profile')
  @ApiOperation({ summary: '获取当前登录用户的信息' })
  @UseGuards(JwtAuthGuard)    // 必须登录才能访问，JwtAuthGuard 会验证 token
  @ApiBearerAuth()            // Swagger 文档中标注此接口需要 Bearer Token
  async getProfile(@Request() req: any) {
    // req.user 是 JWT 策略（jwt.strategy.ts）验证 token 后自动注入的用户信息
    // req.user 中包含 { id, username }，是从 token 中解析出来的
    return this.authService.getProfile(req.user);
  }
}
