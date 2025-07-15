import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 配置 Swagger
  const config = new DocumentBuilder()
    .setTitle('NestJS Mapper Example')
    .setDescription('演示 @ilhamtahir/nest-mapper 的使用示例')
    .setVersion('0.1.0')
    .addTag('用户管理', '用户相关的 API 接口')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // 启用 CORS
  app.enableCors();

  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log(`🚀 应用已启动！`);
  console.log(`📖 API 文档: http://localhost:${port}/api`);
  console.log(`🌐 应用地址: http://localhost:${port}`);
}

bootstrap();
