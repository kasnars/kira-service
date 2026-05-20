// 导入 Injectable 装饰器，标记这是一个可被注入的服务
import { Injectable } from '@nestjs/common';

// @Injectable() 让 NestJS 的依赖注入系统管理此类
// 在 Controller 的构造函数中可以直接使用
@Injectable()
export class AppService {
  // getHello 是最简单的业务逻辑：返回一个字符串
  // 这里应该只处理数据，不应该处理 HTTP 相关的东西（那是 Controller 的职责）
  getHello(): string {
    return 'Hello World!';
  }
}
