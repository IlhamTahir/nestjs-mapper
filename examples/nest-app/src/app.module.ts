import { Module } from '@nestjs/common';
import { MapperModule } from '@ilhamtahir/nest-mapper';
import { AppController } from './app.controller';
import { AppService } from './app.service';

/**
 * 应用主模块
 * 演示如何使用 MapperModule.forRoot() 自动注册所有 Mapper
 */
@Module({
  imports: [
    // 使用 MapperModule.forRoot() 自动注册所有使用 @Mapper() 装饰器的类
    MapperModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
