# NestJS Mapper

[English](./README.md) | 简体中文

[![npm 版本](https://img.shields.io/npm/v/@ilhamtahir/nestjs-mapper.svg)](https://www.npmjs.com/package/@ilhamtahir/nestjs-mapper)
[![npm 下载量](https://img.shields.io/npm/dm/@ilhamtahir/nestjs-mapper.svg)](https://www.npmjs.com/package/@ilhamtahir/nestjs-mapper)
[![npm 许可证](https://img.shields.io/npm/l/@ilhamtahir/nestjs-mapper.svg)](https://www.npmjs.com/package/@ilhamtahir/nestjs-mapper)
[![欢迎 PR](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/ilhamtahir/nestjs-mapper/pulls)
[![GitHub stars](https://img.shields.io/github/stars/ilhamtahir/nestjs-mapper.svg?style=social&label=Star&maxAge=2592000)](https://github.com/ilhamtahir/nestjs-mapper/stargazers/)

一个 TypeScript + NestJS 生态的轻量级 MapStruct 替代品，提供标准化的 DTO ↔ Entity 映射方案。

## 🚀 特性

- **编译期安全**：完全基于 TypeScript，提供类型安全保障
- **最小侵入**：使用装饰器驱动，对现有代码影响最小
- **装饰器驱动**：`@Mapper()` 和 `@Mapping()` 装饰器，简洁易用
- **自动字段映射**：字段名相同时自动赋值，支持类型检查
- **依赖注入支持**：完美集成 NestJS 依赖注入系统
- **嵌套路径支持**：支持 `profile.bio` 等嵌套字段映射
- **🆕 Abstract Class 支持**：支持抽象类和空方法体自动映射
- **🆕 Proxy 自动实现**：空方法体自动调用 transform，保留自定义方法逻辑

## 📦 模块结构

| 模块            | 包名                        | 说明                                      |
| --------------- | --------------------------- | ----------------------------------------- |
| 映射核心逻辑    | `@ilhamtahir/ts-mapper`     | 装饰器注册、映射执行、字段提取等          |
| NestJS 框架封装 | `@ilhamtahir/nestjs-mapper` | 自动依赖注入、模块注册、Mapper 装饰器增强 |
| 示例项目        | `examples/nestjs-app`       | 使用真实 DTO、Entity、Mapper 展示用法     |

## 🛠️ 安装

### 环境要求

- **Node.js**: >= 16.0.0
- **TypeScript**: >= 4.7.0
- **NestJS**: >= 10.0.0
- **reflect-metadata**: >= 0.1.12

### 包安装

```bash
# 安装核心包
npm install @ilhamtahir/ts-mapper

# 安装 NestJS 集成包
npm install @ilhamtahir/nestjs-mapper

# 或使用 yarn
yarn add @ilhamtahir/ts-mapper @ilhamtahir/nestjs-mapper

# 或使用 pnpm
pnpm add @ilhamtahir/ts-mapper @ilhamtahir/nestjs-mapper
```

### 包信息

| 包名                        | 大小                                                                                  | 依赖关系                     |
| --------------------------- | ------------------------------------------------------------------------------------- | ---------------------------- |
| `@ilhamtahir/ts-mapper`     | ![npm bundle size](https://img.shields.io/bundlephobia/min/@ilhamtahir/ts-mapper)     | 零依赖                       |
| `@ilhamtahir/nestjs-mapper` | ![npm bundle size](https://img.shields.io/bundlephobia/min/@ilhamtahir/nestjs-mapper) | 依赖 `@ilhamtahir/ts-mapper` |

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
import { Mapper, Mapping, transform } from '@ilhamtahir/nestjs-mapper';

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
import { MapperModule } from '@ilhamtahir/nestjs-mapper';

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
    const entity = {
      /* ... */
    };
    return this.userMapper.toDto(entity);
  }
}
```

## 🆕 新特性：Abstract Class + Proxy 自动映射

### 使用 Abstract Class（推荐）

```typescript
// user-abstract.mapper.ts
import { Mapper, Mapping } from '@ilhamtahir/nestjs-mapper';

@Mapper()
export abstract class UserAbstractMapper {
  /**
   * 空方法体：系统会自动调用 transform
   */
  @Mapping({ source: 'fullName', target: 'name' })
  @Mapping({ source: 'profile.bio', target: 'bio' })
  @Mapping({ source: 'profile.avatar', target: 'avatar' })
  toDto(entity: UserEntity): UserDto {
    // 空方法体，系统会自动调用 transform
    return {} as UserDto;
  }

  /**
   * 批量转换
   */
  toDtoList(entities: UserEntity[]): UserDto[] {
    return entities.map(entity => this.toDto(entity));
  }
}
```

### 混合模式：空方法体 + 自定义方法

```typescript
// user-mixed.mapper.ts
@Mapper()
export class UserMixedMapper {
  /**
   * 空方法体：自动执行 transform
   */
  @Mapping({ source: 'fullName', target: 'name' })
  toDto(entity: UserEntity): UserDto {
    return {} as UserDto; // 自动映射
  }

  /**
   * 自定义方法：保留原始逻辑
   */
  toDtoWithCustomLogic(entity: UserEntity): UserDto {
    const dto = new UserDto();
    dto.name = `[VIP] ${entity.fullName}`; // 自定义逻辑
    dto.email = entity.email.toLowerCase();
    // ... 其他自定义逻辑
    return dto;
  }
}
```

## 🚀 开发和发布

### 开发环境设置

```bash
# 克隆项目
git clone https://github.com/ilhamtahir/nestjs-mapper.git
cd nestjs-mapper

# 安装依赖
pnpm install

# 构建项目
pnpm build

# 运行示例
pnpm dev:example
```

### 代码质量

```bash
# 代码检查
pnpm run lint

# 代码格式化
pnpm run format

# 类型检查
pnpm run type-check

# 预发布检查
pnpm run pre-release
```

### 发布流程

```bash
# 测试发布流程
pnpm run test-release patch

# 实际发布
./scripts/release.sh patch   # 补丁版本
./scripts/release.sh minor   # 次要版本
./scripts/release.sh major   # 主要版本
```

## 📚 API 文档

### 装饰器

- `@Mapper()`：标记类为映射器，自动注册到 NestJS 容器
- `@Mapping({ source, target })`：显式字段映射定义

### 工具函数

- `transform(mapper, method, input, OutputType)`：执行映射转换
- `createMapperProxy(MapperClass)`：创建支持自动映射的代理对象

### 高级使用示例

#### 复杂嵌套映射

```typescript
@Mapper()
export class OrderMapper {
  @Mapping({ source: 'customer.profile.firstName', target: 'customerName' })
  @Mapping({ source: 'customer.profile.email', target: 'customerEmail' })
  @Mapping({ source: 'items', target: 'orderItems' })
  toDto(entity: OrderEntity): OrderDto {
    return transform(this, 'toDto', entity, OrderDto);
  }
}
```

#### 数组和集合映射

```typescript
@Mapper()
export class ProductMapper {
  toDto(entity: ProductEntity): ProductDto {
    return transform(this, 'toDto', entity, ProductDto);
  }

  toDtoList(entities: ProductEntity[]): ProductDto[] {
    return entities.map(entity => this.toDto(entity));
  }

  // 双向映射
  toEntity(dto: ProductDto): ProductEntity {
    return transform(this, 'toEntity', dto, ProductEntity);
  }
}
```

#### 自定义转换逻辑

```typescript
@Mapper()
export class UserMapper {
  @Mapping({ source: 'fullName', target: 'displayName' })
  toDto(entity: UserEntity): UserDto {
    const dto = transform(this, 'toDto', entity, UserDto);

    // 自定义后处理
    dto.displayName = dto.displayName?.toUpperCase();
    dto.createdAt = new Date(entity.createdAt).toISOString();

    return dto;
  }
}
```

## 🔧 故障排除

### 常见问题

#### TypeScript 编译错误

```bash
# 确保您有正确的 TypeScript 版本
npm install typescript@^4.7.0 --save-dev

# 在 tsconfig.json 中启用实验性装饰器
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

#### 在 DI 容器中找不到 Mapper

```typescript
// 确保在应用模块中导入 MapperModule
@Module({
  imports: [
    MapperModule.forRoot(), // 这是必需的！
  ],
})
export class AppModule {}
```

#### 循环依赖问题

```typescript
// 对循环依赖使用 forwardRef
@Injectable()
export class UserService {
  constructor(
    @Inject(forwardRef(() => UserMapper))
    private readonly userMapper: UserMapper
  ) {}
}
```

### 性能提示

- 使用带有空方法体的抽象类以获得更好的性能
- 避免在映射方法中进行复杂的转换
- 考虑为频繁使用的映射进行缓存
- 对大型数据集使用批量操作

## 📋 更新日志

详细的发布说明和版本历史请查看 [CHANGELOG.md](./CHANGELOG.md)。

## 🌟 生态系统

### 相关项目

- [MapStruct](https://mapstruct.org/) - Java 映射框架（灵感来源）
- [AutoMapper](https://automapper.org/) - .NET 对象映射库
- [class-transformer](https://github.com/typestack/class-transformer) - TypeScript 转换库

### 社区资源

- [文档站点](https://ilhamtahir.github.io/nestjs-mapper/)（即将推出）
- [示例仓库](./examples/) - 真实世界的使用示例
- [Wiki](https://github.com/ilhamtahir/nestjs-mapper/wiki) - 额外的指南和教程

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

### 贡献流程

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'feat: add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 📞 支持

如果遇到问题，请：

1. 查看 [FAQ](https://github.com/ilhamtahir/nestjs-mapper/wiki/FAQ)
2. 搜索 [现有 Issues](https://github.com/ilhamtahir/nestjs-mapper/issues)
3. 创建 [新 Issue](https://github.com/ilhamtahir/nestjs-mapper/issues/new/choose)

## 📄 许可证

MIT License
