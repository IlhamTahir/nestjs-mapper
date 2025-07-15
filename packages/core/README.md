# @ilhamtahir/ts-mapper

[![npm version](https://img.shields.io/npm/v/@ilhamtahir/ts-mapper.svg)](https://www.npmjs.com/package/@ilhamtahir/ts-mapper)
[![npm downloads](https://img.shields.io/npm/dm/@ilhamtahir/ts-mapper.svg)](https://www.npmjs.com/package/@ilhamtahir/ts-mapper)
[![npm license](https://img.shields.io/npm/l/@ilhamtahir/ts-mapper.svg)](https://www.npmjs.com/package/@ilhamtahir/ts-mapper)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/ilhamtahir/nestjs-mapper/pulls)

Core package for TypeScript object mapping with decorator support. Part of the NestJS Mapper ecosystem.

## 📦 Installation

```bash
# npm
npm install @ilhamtahir/ts-mapper

# yarn
yarn add @ilhamtahir/ts-mapper

# pnpm
pnpm add @ilhamtahir/ts-mapper
```

## 🚀 Features

- **Compile-time Safety**: Fully TypeScript-based with type safety guarantees
- **Minimal Intrusion**: Decorator-driven approach with minimal impact on existing code
- **Automatic Field Mapping**: Auto-assignment for same-named fields with type checking
- **Nested Path Support**: Support for nested field mapping like `profile.bio`
- **Abstract Class Support**: Support for abstract classes and empty method body auto-mapping
- **Proxy Auto Implementation**: Empty method bodies automatically call transform

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
import { Mapper, Mapping, transform } from '@ilhamtahir/ts-mapper';

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

### 3. Use Mapper

```typescript
// app.ts
const userMapper = new UserMapper();

const entity = {
  id: 1,
  fullName: 'John Doe',
  age: 30,
  email: 'john@example.com',
  profile: {
    bio: 'Software Developer',
    avatar: 'avatar.jpg',
  },
};

const dto = userMapper.toDto(entity);
console.log(dto);
// Output:
// {
//   id: 1,
//   name: 'John Doe',
//   age: 30,
//   email: 'john@example.com',
//   bio: 'Software Developer',
//   avatar: 'avatar.jpg'
// }
```

## 🆕 Abstract Class + Proxy Support

### Using Abstract Class (Recommended)

```typescript
// user-abstract.mapper.ts
import { Mapper, Mapping } from '@ilhamtahir/ts-mapper';

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

// Usage
const userMapper = createMapperProxy(UserAbstractMapper);
const dto = userMapper.toDto(entity);
```

## 📚 API Documentation

### Decorators

- `@Mapper()`: Mark class as mapper
- `@Mapping({ source, target })`: Explicit field mapping definition

### Utility Functions

- `transform(mapper, method, input, OutputType)`: Execute mapping transformation
- `createMapperProxy(MapperClass)`: Create proxy object supporting auto-mapping

## 🔧 Troubleshooting

### TypeScript Compilation Errors

```bash
# Make sure you have the correct TypeScript version
npm install typescript@^4.7.0 --save-dev

# Enable experimental decorators in tsconfig.json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

## 📋 Resources

- [Full Documentation](https://github.com/ilhamtahir/nestjs-mapper)
- [FAQ](https://github.com/ilhamtahir/nestjs-mapper/blob/main/FAQ.md)
- [Performance Guide](https://github.com/ilhamtahir/nestjs-mapper/blob/main/PERFORMANCE.md)
- [Contributing Guide](https://github.com/ilhamtahir/nestjs-mapper/blob/main/CONTRIBUTING.md)
- [Changelog](https://github.com/ilhamtahir/nestjs-mapper/blob/main/CHANGELOG.md)

## 🤝 Related Packages

- [@ilhamtahir/nestjs-mapper](https://www.npmjs.com/package/@ilhamtahir/nestjs-mapper): NestJS integration for this package

## 📄 License

MIT License
