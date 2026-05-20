// 从 @nestjs/core 导入创建应用的工厂
import { NestFactory } from '@nestjs/core';
// 导入全局校验管道，用于验证请求参数是否合法
import { ValidationPipe } from '@nestjs/common';
// 导入根模块，NestJS 从这里启动
import { AppModule } from './app.module';

// bootstrap 是 NestJS 约定的启动函数名
async function bootstrap() {
  // 创建 NestJS 应用实例，AppModule 是所有模块的入口
  const app = await NestFactory.create(AppModule);

  // 注册全局校验管道，所有请求都会经过这里处理
  app.useGlobalPipes(
    new ValidationPipe({
      // 自动移除 DTO 中未定义的字段，防止前端传多余数据
      whitelist: true,
      // 如果请求包含 DTO 未定义的字段，直接返回 400 错误
      forbidNonWhitelisted: true,
      // 自动把请求参数转换成 DTO 中声明的类型（比如字符串转数字）
      transform: true,
    }),
  );

  // 启动 HTTP 服务器，优先使用环境变量 PORT，默认 3000
  await app.listen(process.env.PORT ?? 3000);
}

// 执行启动函数
bootstrap();
