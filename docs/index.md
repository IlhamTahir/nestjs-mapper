---
layout: home

hero:
  name: 'ts-mapper'
  text: 'TypeScript Object Mapping'
  tagline: Type-safe object mapping library for TypeScript and NestJS, a MapStruct alternative for Node.js ecosystem
  image:
    src: /logo.svg
    alt: ts-mapper
  actions:
    - theme: brand
      text: Get Started
      link: /en/guide/core/getting-started
    - theme: alt
      text: NestJS Integration
      link: /en/guide/nest/getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/ilhamtahir/nestjs-mapper

features:
  - icon: 🛡️
    title: Type Safe
    details: Fully TypeScript-based with compile-time type checking and IntelliSense support
  - icon: 🎯
    title: Decorator Driven
    details: Simple @Mapper() and @Mapping() decorators with minimal impact on existing code
  - icon: ⚡
    title: Auto Mapping
    details: Automatic field mapping for same-named fields, supports nested path mapping like profile.bio
  - icon: 🔄
    title: Dependency Injection
    details: Perfect integration with NestJS DI system, supports automatic Mapper registration and injection
  - icon: 🏗️
    title: Abstract Class Support
    details: Supports abstract classes and empty method body auto-mapping with Proxy auto-implementation
  - icon: 📦
    title: Modular Design
    details: Core functionality separated from NestJS integration, can be used independently or with NestJS
---

## Quick Preview

### Core Functionality (@ilhamtahir/ts-mapper)

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

### NestJS Integration (@ilhamtahir/nestjs-mapper)

```typescript
import { Mapper, Mapping } from '@ilhamtahir/nestjs-mapper';

@Mapper()
export abstract class UserMapper {
  @Mapping({ source: 'fullName', target: 'name' })
  @Mapping({ source: 'profile.bio', target: 'bio' })
  abstract toDto(entity: UserEntity): UserDto; // Auto-implemented

  // Custom method logic preserved
  toDtoWithExtra(entity: UserEntity): UserDto {
    const dto = this.toDto(entity);
    dto.extra = 'custom logic';
    return dto;
  }
}
```

### Module Configuration

```typescript
import { Module } from '@nestjs/common';
import { MapperModule } from '@ilhamtahir/nestjs-mapper';

@Module({
  imports: [
    MapperModule.forRoot(), // Auto-register all @Mapper() classes
  ],
})
export class AppModule {}
```

## Installation

::: code-group

```bash [npm]
# Core package
npm install @ilhamtahir/ts-mapper

# NestJS integration package
npm install @ilhamtahir/nestjs-mapper
```

```bash [yarn]
# Core package
yarn add @ilhamtahir/ts-mapper

# NestJS integration package
yarn add @ilhamtahir/nestjs-mapper
```

```bash [pnpm]
# Core package
pnpm add @ilhamtahir/ts-mapper

# NestJS integration package
pnpm add @ilhamtahir/nestjs-mapper
```

:::

## Why Choose ts-mapper?

- **🚀 Development Efficiency**: Reduce manual DTO ↔ Entity conversion code
- **🛡️ Type Safety**: Native TypeScript support with compile-time error checking
- **🎯 Minimal Intrusion**: Decorator-driven approach without affecting existing code structure
- **⚡ Performance Optimized**: Compile-time metadata processing, efficient runtime execution
- **🔧 Flexible Configuration**: Support for custom transformation strategies and nested mapping
- **🏗️ Enterprise Ready**: Complete NestJS ecosystem integration with dependency injection support

## Community & Support

- [GitHub Issues](https://github.com/ilhamtahir/nestjs-mapper/issues) - Report issues and feature requests
- [GitHub Discussions](https://github.com/ilhamtahir/nestjs-mapper/discussions) - Community discussions
- [NPM Package](https://www.npmjs.com/package/@ilhamtahir/ts-mapper) - View package information
- [Example Projects](https://github.com/ilhamtahir/nestjs-mapper/tree/main/examples) - Complete usage examples
