# NestJS Mapper

一个 TypeScript + NestJS 生态的轻量级 MapStruct 替代品，提供标准化的 DTO ↔ Entity 映射方案。

## 🚀 特性

- **编译期安全**：完全基于 TypeScript，提供类型安全保障
- **最小侵入**：使用装饰器驱动，对现有代码影响最小
- **装饰器驱动**：`@Mapper()` 和 `@Mapping()` 装饰器，简洁易用
- **自动字段映射**：字段名相同时自动赋值，支持类型检查
- **依赖注入支持**：完美集成 NestJS 依赖注入系统
- **嵌套路径支持**：支持 `profile.bio` 等嵌套字段映射

## 📦 模块结构

| 模块 | 包名 | 说明 |
|------|------|------|
| 映射核心逻辑 | `@ilhamtahir/ts-mapper` | 装饰器注册、映射执行、字段提取等 |
| NestJS 框架封装 | `@ilhamtahir/nest-mapper` | 自动依赖注入、模块注册、Mapper 装饰器增强 |
| 示例项目 | `examples/nest-app` | 使用真实 DTO、Entity、Mapper 展示用法 |

## 🛠️ 安装

```bash
# 安装核心包
npm install @ilhamtahir/ts-mapper

# 安装 NestJS 集成包
npm install @ilhamtahir/nest-mapper
```

## 📖 快速开始

### 1. 定义实体和 DTO

```typescript
// user.entity.ts
export class UserEntity {
  id: number;
  fullName: string;
  age: number;
  email: string;
  profile: {
    bio: string;
    avatar: string;
  };
}

// user.dto.ts
export class UserDto {
  id: number;
  name: string;
  age: number;
  email: string;
  bio: string;
  avatar: string;
}
```

### 2. 创建 Mapper

```typescript
// user.mapper.ts
import { Mapper, Mapping, transform } from '@ilhamtahir/nest-mapper';

@Mapper()
export class UserMapper {
  @Mapping({ source: 'fullName', target: 'name' })
  @Mapping({ source: 'profile.bio', target: 'bio' })
  @Mapping({ source: 'profile.avatar', target: 'avatar' })
  toDto(entity: UserEntity): UserDto {
    return transform(this, 'toDto', entity, UserDto);
  }
}
```

### 3. 配置模块

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { MapperModule } from '@ilhamtahir/nest-mapper';

@Module({
  imports: [
    MapperModule.forRoot(), // 自动注册所有 @Mapper() 类
  ],
  // ...
})
export class AppModule {}
```

### 4. 使用 Mapper

```typescript
// app.service.ts
import { Injectable } from '@nestjs/common';
import { UserMapper } from './mappers/user.mapper';

@Injectable()
export class AppService {
  constructor(private readonly userMapper: UserMapper) {}

  getUser(): UserDto {
    const entity = { /* ... */ };
    return this.userMapper.toDto(entity);
  }
}
```

## 🏃‍♂️ 运行示例

```bash
# 安装依赖
pnpm install

# 构建所有包
pnpm build

# 运行示例应用
pnpm dev:example
```

访问 http://localhost:3000/api 查看 Swagger 文档。

## 📚 API 文档

### 装饰器

- `@Mapper()`：标记类为映射器，自动注册到 NestJS 容器
- `@Mapping({ source, target })`：显式字段映射定义

### 工具函数

- `transform(mapper, method, input, OutputType)`：执行映射转换

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License
