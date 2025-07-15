# @ilhamtahir/nestjs-mapper

[![npm version](https://img.shields.io/npm/v/@ilhamtahir/nestjs-mapper.svg)](https://www.npmjs.com/package/@ilhamtahir/nestjs-mapper)
[![npm downloads](https://img.shields.io/npm/dm/@ilhamtahir/nestjs-mapper.svg)](https://www.npmjs.com/package/@ilhamtahir/nestjs-mapper)
[![npm license](https://img.shields.io/npm/l/@ilhamtahir/nestjs-mapper.svg)](https://www.npmjs.com/package/@ilhamtahir/nestjs-mapper)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/ilhamtahir/nestjs-mapper/pulls)

NestJS integration for @ilhamtahir/ts-mapper - A MapStruct-like object mapping library for TypeScript and NestJS.

## 📦 Installation

```bash
# Install both packages
npm install @ilhamtahir/ts-mapper @ilhamtahir/nestjs-mapper

# Or using yarn
yarn add @ilhamtahir/ts-mapper @ilhamtahir/nestjs-mapper

# Or using pnpm
pnpm add @ilhamtahir/ts-mapper @ilhamtahir/nestjs-mapper
```

## 🚀 Features

- **NestJS Integration**: Seamless dependency injection support
- **Auto Registration**: Automatic mapper registration in DI container
- **Enhanced Decorators**: NestJS-specific decorator enhancements
- **Module Configuration**: Easy module setup with `MapperModule`
- **Proxy Support**: Automatic proxy creation for abstract mappers

## 📖 Quick Start

### 1. Configure Module

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { MapperModule } from '@ilhamtahir/nestjs-mapper';

@Module({
  imports: [
    MapperModule.forRoot(), // Auto-register all @Mapper() classes
  ],
})
export class AppModule {}
```

### 2. Create Mapper

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

### 3. Use in Service

```typescript
// user.service.ts
import { Injectable } from '@nestjs/common';
import { UserMapper } from './mappers/user.mapper';

@Injectable()
export class UserService {
  constructor(private readonly userMapper: UserMapper) {}

  async getUser(id: number): Promise<UserDto> {
    const entity = await this.userRepository.findById(id);
    return this.userMapper.toDto(entity);
  }

  async getUsers(): Promise<UserDto[]> {
    const entities = await this.userRepository.findAll();
    return entities.map(entity => this.userMapper.toDto(entity));
  }
}
```

## 🆕 Abstract Class Support

### Using Abstract Mapper (Recommended)

```typescript
// user-abstract.mapper.ts
import { Mapper, Mapping } from '@ilhamtahir/nestjs-mapper';

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
   * Custom method with business logic
   */
  toDtoWithCustomLogic(entity: UserEntity): UserDto {
    const dto = this.toDto(entity); // Calls auto-mapping

    // Add custom logic
    dto.displayName = `${dto.name} (${entity.age} years old)`;
    dto.isActive = entity.lastLoginAt > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    return dto;
  }
}
```

### Dependency Injection in Mappers

```typescript
// advanced-user.mapper.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Mapper, Mapping, transform } from '@ilhamtahir/nestjs-mapper';

@Mapper()
@Injectable()
export class AdvancedUserMapper {
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: Logger
  ) {}

  @Mapping({ source: 'fullName', target: 'name' })
  toDto(entity: UserEntity): UserDto {
    this.logger.log(`Mapping user: ${entity.id}`);

    const dto = transform(this, 'toDto', entity, UserDto);

    // Use injected services
    const baseUrl = this.configService.get('app.baseUrl');
    dto.avatarUrl = `${baseUrl}/avatars/${dto.avatar}`;

    return dto;
  }
}
```

## 🔧 Advanced Configuration

### Custom Module Configuration

```typescript
// app.module.ts
@Module({
  imports: [
    MapperModule.forRoot({
      // Custom configuration options (if available in future versions)
    }),
  ],
})
export class AppModule {}
```

### Feature Module Integration

```typescript
// user.module.ts
import { Module } from '@nestjs/common';
import { MapperModule } from '@ilhamtahir/nestjs-mapper';
import { UserMapper } from './mappers/user.mapper';
import { UserService } from './user.service';

@Module({
  imports: [MapperModule], // Import without forRoot() in feature modules
  providers: [UserService, UserMapper],
  exports: [UserService, UserMapper],
})
export class UserModule {}
```

## 🔧 Troubleshooting

### Mapper Not Found in DI Container

```typescript
// Make sure to import MapperModule in your app module
@Module({
  imports: [
    MapperModule.forRoot(), // This is required!
  ],
})
export class AppModule {}
```

### Circular Dependency Issues

```typescript
// Use forwardRef for circular dependencies
@Injectable()
export class UserService {
  constructor(
    @Inject(forwardRef(() => UserMapper))
    private readonly userMapper: UserMapper
  ) {}
}
```

## 📚 API Documentation

### Module

- `MapperModule.forRoot()`: Configure and register the mapper module

### Decorators

- `@Mapper()`: Mark class as mapper and register in NestJS DI container
- `@Mapping({ source, target })`: Explicit field mapping definition

### Utility Functions

- `transform(mapper, method, input, OutputType)`: Execute mapping transformation

## 📋 Resources

- [Full Documentation](https://github.com/ilhamtahir/nestjs-mapper)
- [Core Package (@ilhamtahir/ts-mapper)](https://www.npmjs.com/package/@ilhamtahir/ts-mapper)
- [FAQ](https://github.com/ilhamtahir/nestjs-mapper/blob/main/FAQ.md)
- [Performance Guide](https://github.com/ilhamtahir/nestjs-mapper/blob/main/PERFORMANCE.md)
- [Contributing Guide](https://github.com/ilhamtahir/nestjs-mapper/blob/main/CONTRIBUTING.md)
- [Changelog](https://github.com/ilhamtahir/nestjs-mapper/blob/main/CHANGELOG.md)

## 🤝 Related Packages

- [@ilhamtahir/ts-mapper](https://www.npmjs.com/package/@ilhamtahir/ts-mapper): Core mapping functionality

## 📄 License

MIT License
