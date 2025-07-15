---
layout: home

hero:
  name: 'ts-mapper'
  text: 'TypeScript 对象映射工具'
  tagline: 适用于 TypeScript 和 NestJS 的类型安全对象映射库，MapStruct 的 Node.js 替代方案
  image:
    src: /logo.svg
    alt: ts-mapper
  actions:
    - theme: brand
      text: 快速开始
      link: /zh/guide/core/getting-started
    - theme: alt
      text: NestJS 集成
      link: /zh/guide/nest/getting-started
    - theme: alt
      text: 查看 GitHub
      link: https://github.com/ilhamtahir/nest-mapper

features:
  - icon: 🛡️
    title: 类型安全
    details: 完全基于 TypeScript，提供编译期类型检查和 IntelliSense 支持
  - icon: 🎯
    title: 装饰器驱动
    details: 使用 @Mapper() 和 @Mapping() 装饰器，简洁易用，对现有代码影响最小
  - icon: ⚡
    title: 自动映射
    details: 字段名相同时自动赋值，支持嵌套路径映射如 profile.bio
  - icon: 🔄
    title: 依赖注入
    details: 完美集成 NestJS 依赖注入系统，支持 Mapper 自动注册和注入
  - icon: 🏗️
    title: 抽象类支持
    details: 支持抽象类和空方法体自动映射，Proxy 自动实现保留自定义逻辑
  - icon: 📦
    title: 模块化设计
    details: 核心功能与 NestJS 集成分离，可独立使用或配合 NestJS 使用
---

## 快速预览

### 核心功能 (@ilhamtahir/ts-mapper)

```typescript
import { Mapper, Mapping, transform } from '@ilhamtahir/ts-mapper';

@Mapper()
class UserMapper {
  @Mapping({ source: 'fullName', target: 'name' })
  @Mapping({ source: 'profile.bio', target: 'bio' })
  toDto(entity: UserEntity): UserDto {
    return transform(this, 'toDto', entity, UserDto);
  }
}
```

### NestJS 集成 (@ilhamtahir/nest-mapper)

```typescript
import { Mapper, Mapping } from '@ilhamtahir/nest-mapper';

@Mapper()
export abstract class UserMapper {
  @Mapping({ source: 'fullName', target: 'name' })
  @Mapping({ source: 'profile.bio', target: 'bio' })
  abstract toDto(entity: UserEntity): UserDto; // 自动实现

  // 自定义方法逻辑保留
  toDtoWithExtra(entity: UserEntity): UserDto {
    const dto = this.toDto(entity);
    dto.extra = 'custom logic';
    return dto;
  }
}
```

### 模块配置

```typescript
import { Module } from '@nestjs/common';
import { MapperModule } from '@ilhamtahir/nest-mapper';

@Module({
  imports: [
    MapperModule.forRoot(), // 自动注册所有 @Mapper() 类
  ],
})
export class AppModule {}
```

## 安装

::: code-group

```bash [npm]
# 核心包
npm install @ilhamtahir/ts-mapper

# NestJS 集成包
npm install @ilhamtahir/nest-mapper
```

```bash [yarn]
# 核心包
yarn add @ilhamtahir/ts-mapper

# NestJS 集成包
yarn add @ilhamtahir/nest-mapper
```

```bash [pnpm]
# 核心包
pnpm add @ilhamtahir/ts-mapper

# NestJS 集成包
pnpm add @ilhamtahir/nest-mapper
```

:::

## 为什么选择 ts-mapper？

- **🚀 开发效率**: 减少手动编写 DTO ↔ Entity 转换代码
- **🛡️ 类型安全**: TypeScript 原生支持，编译期错误检查
- **🎯 最小侵入**: 装饰器驱动，不影响现有代码结构
- **⚡ 性能优化**: 编译期元数据处理，运行时高效执行
- **🔧 灵活配置**: 支持自定义转换策略和嵌套映射
- **🏗️ 企业级**: 完整的 NestJS 生态集成，支持依赖注入

## 社区与支持

- [GitHub Issues](https://github.com/ilhamtahir/nest-mapper/issues) - 报告问题和功能请求
- [GitHub Discussions](https://github.com/ilhamtahir/nest-mapper/discussions) - 社区讨论
- [NPM Package](https://www.npmjs.com/package/@ilhamtahir/ts-mapper) - 查看包信息
- [示例项目](https://github.com/ilhamtahir/nest-mapper/tree/main/examples) - 完整使用示例
