// 导入 Controller 装饰器（声明此类处理 HTTP 请求）
// 导入 Get 装饰器（声明此方法处理 GET 请求）
import { Controller, Get } from '@nestjs/common';
// 导入 AppService，业务逻辑写在 Service 层
import { AppService } from './app.service';

// @Controller() 没有参数，表示这个控制器映射在根路径 /
// 如果是 @Controller('api')，则所有路由都会带 /api 前缀
@Controller()
export class AppController {
  // 构造函数注入 AppService
  // NestJS 会自动创建 AppService 实例并传入，不需要手动 new
  constructor(private readonly appService: AppService) {}

  // @Get() 声明此方法处理 GET 请求
  // 因为 Controller 是根路径，所以这个接口是 GET /
  @Get()
  getHello(): string {
    // 调用 Service 层的方法获取数据，然后返回
    // NestJS 会自动把返回值序列化成 JSON 响应给前端
    return this.appService.getHello();
  }
}
