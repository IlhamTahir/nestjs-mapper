# NestJS Mapper

[English](./README.md) | 简体中文

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

| 模块            | 包名                      | 说明                                      |
| --------------- | ------------------------- | ----------------------------------------- |
| 映射核心逻辑    | `@ilhamtahir/ts-mapper`   | 装饰器注册、映射执行、字段提取等          |
| NestJS 框架封装 | `@ilhamtahir/nest-mapper` | 自动依赖注入、模块注册、Mapper 装饰器增强 |
| 示例项目        | `examples/nest-app`       | 使用真实 DTO、Entity、Mapper 展示用法     |

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
import { Mapper, Mapping } from '@ilhamtahir/nest-mapper';

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
git clone https://github.com/ilhamtahir/nest-mapper.git
cd nest-mapper

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

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 支持

如果遇到问题，请：

1. 查看 [FAQ](https://github.com/ilhamtahir/nest-mapper/wiki/FAQ)
2. 搜索 [现有 Issues](https://github.com/ilhamtahir/nest-mapper/issues)
3. 创建 [新 Issue](https://github.com/ilhamtahir/nest-mapper/issues/new/choose)

## 📄 许可证

MIT License
