# NestJS Mapper

English | [简体中文](README.zh-CN.md)

A lightweight MapStruct alternative for TypeScript + NestJS ecosystem, providing standardized DTO ↔ Entity mapping solutions.

## 🚀 Features

- **Compile-time Safety**: Fully TypeScript-based with type safety guarantees
- **Minimal Intrusion**: Decorator-driven approach with minimal impact on existing code
- **Decorator-driven**: Simple `@Mapper()` and `@Mapping()` decorators
- **Automatic Field Mapping**: Auto-assignment for same-named fields with type checking
- **Dependency Injection**: Perfect integration with NestJS DI system
- **Nested Path Support**: Support for nested field mapping like `profile.bio`
- **🆕 Abstract Class Support**: Support for abstract classes and empty method body auto-mapping
- **🆕 Proxy Auto Implementation**: Empty method bodies automatically call transform, preserving custom method logic

## 📦 Package Structure

| Module             | Package Name              | Description                                                               |
| ------------------ | ------------------------- | ------------------------------------------------------------------------- |
| Core Mapping Logic | `@ilhamtahir/ts-mapper`   | Decorator registration, mapping execution, field extraction               |
| NestJS Integration | `@ilhamtahir/nest-mapper` | Auto dependency injection, module registration, enhanced Mapper decorator |
| Example Project    | `examples/nest-app`       | Real-world usage examples with DTO, Entity, and Mapper                    |

## 🛠️ Installation

```bash
# Install core package
npm install @ilhamtahir/ts-mapper

# Install NestJS integration package
npm install @ilhamtahir/nest-mapper
```

## 📖 Quick Start

### 1. Define Entity and DTO

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

### 2. Create Mapper

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

### 3. Configure Module

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { MapperModule } from '@ilhamtahir/nest-mapper';

@Module({
  imports: [
    MapperModule.forRoot(), // Auto-register all @Mapper() classes
  ],
  // ...
})
export class AppModule {}
```

### 4. Use Mapper

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

## 🏃‍♂️ Running Examples

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run example application
pnpm dev:example
```

Visit http://localhost:3000/api to view Swagger documentation.

## 🆕 New Feature: Abstract Class + Proxy Auto-mapping

### Using Abstract Class (Recommended)

```typescript
// user-abstract.mapper.ts
import { Mapper, Mapping } from '@ilhamtahir/nest-mapper';

@Mapper()
export abstract class UserAbstractMapper {
  /**
   * Empty method body: system will automatically call transform
   */
  @Mapping({ source: 'fullName', target: 'name' })
  @Mapping({ source: 'profile.bio', target: 'bio' })
  @Mapping({ source: 'profile.avatar', target: 'avatar' })
  toDto(entity: UserEntity): UserDto {
    // Empty method body, system will automatically call transform
    return {} as UserDto;
  }

  /**
   * Batch conversion
   */
  toDtoList(entities: UserEntity[]): UserDto[] {
    return entities.map(entity => this.toDto(entity));
  }
}
```

### Mixed Mode: Empty Method Body + Custom Methods

```typescript
// user-mixed.mapper.ts
@Mapper()
export class UserMixedMapper {
  /**
   * Empty method body: automatically executes transform
   */
  @Mapping({ source: 'fullName', target: 'name' })
  toDto(entity: UserEntity): UserDto {
    return {} as UserDto; // Auto-mapping
  }

  /**
   * Custom method: preserves original logic
   */
  toDtoWithCustomLogic(entity: UserEntity): UserDto {
    const dto = new UserDto();
    dto.name = `[VIP] ${entity.fullName}`; // Custom logic
    dto.email = entity.email.toLowerCase();
    // ... other custom logic
    return dto;
  }
}
```

### How It Works

1. **Empty Method Body Detection**: System automatically detects methods containing only `return {} as Type;`
2. **Auto Proxy**: `MapperModule.forRoot()` automatically creates proxies for all Mappers
3. **Smart Routing**:
   - Empty method body → Automatically calls `transform()`
   - Non-empty method body → Preserves original logic
4. **Full Compatibility**: Existing code requires no modifications and continues to work normally

## 📚 API Documentation

### Decorators

- `@Mapper()`: Mark class as mapper, automatically register to NestJS container
- `@Mapping({ source, target })`: Explicit field mapping definition

### Utility Functions

- `transform(mapper, method, input, OutputType)`: Execute mapping transformation
- `createMapperProxy(MapperClass)`: Create proxy object supporting auto-mapping

## 🚀 Development and Release

### Development Setup

```bash
# Clone project
git clone https://github.com/ilhamtahir/nest-mapper.git
cd nest-mapper

# Install dependencies
pnpm install

# Build project
pnpm build

# Run examples
pnpm dev:example
```

### Code Quality

The project is configured with comprehensive code quality tools:

```bash
# Code linting
pnpm run lint

# Code formatting
pnpm run format

# Type checking
pnpm run type-check

# Pre-release checks (includes all above checks + build)
pnpm run pre-release
```

### Release Process

```bash
# Test release process (without actual publishing)
pnpm run test-release patch

# Actual release
./scripts/release.sh patch   # Patch version
./scripts/release.sh minor   # Minor version
./scripts/release.sh major   # Major version
```

For detailed release instructions, please refer to [RELEASE.md](./RELEASE.md).

### Commit Convention

The project uses [Conventional Commits](https://www.conventionalcommits.org/) specification:

```bash
feat: add new feature
fix: fix bug
docs: update documentation
style: code formatting
refactor: refactor code
test: add tests
chore: build tools or dependency updates
```

## 🤝 Contributing

Issues and Pull Requests are welcome!

### Contributing Process

1. Fork the project
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Create a Pull Request

## 📞 Support

If you encounter any issues:

1. Check the [FAQ](https://github.com/ilhamtahir/nest-mapper/wiki/FAQ)
2. Search [existing Issues](https://github.com/ilhamtahir/nest-mapper/issues)
3. Create a [new Issue](https://github.com/ilhamtahir/nest-mapper/issues/new/choose)
4. Visit [Discussions](https://github.com/ilhamtahir/nest-mapper/discussions)

## 📄 License

MIT License
