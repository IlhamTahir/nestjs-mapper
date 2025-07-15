# Getting Started

`@ilhamtahir/ts-mapper` is a lightweight TypeScript object mapping library that provides type-safe DTO ↔ Entity conversion functionality.

## Installation

::: code-group

```bash [npm]
npm install @ilhamtahir/ts-mapper
```

```bash [yarn]
yarn add @ilhamtahir/ts-mapper
```

```bash [pnpm]
pnpm add @ilhamtahir/ts-mapper
```

:::

## TypeScript Configuration

Make sure your `tsconfig.json` has decorator support enabled:

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

## Basic Usage

### 1. Define Data Models

First, define your entity and DTO classes:

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
  createdAt: Date;
  updatedAt: Date;
}

// user.dto.ts
export class UserDto {
  id: number;
  name: string; // maps to entity.fullName
  age: number;
  email: string;
  bio: string; // maps to entity.profile.bio
  avatar: string; // maps to entity.profile.avatar
}
```

### 2. Create Mapper

Use `@Mapper()` decorator to mark mapping class, and `@Mapping()` decorator to define field mapping rules:

```typescript
// user.mapper.ts
import { Mapper, Mapping, transform } from '@ilhamtahir/ts-mapper';
import { UserEntity } from './user.entity';
import { UserDto } from './user.dto';

@Mapper()
export class UserMapper {
  @Mapping({ source: 'fullName', target: 'name' })
  @Mapping({ source: 'profile.bio', target: 'bio' })
  @Mapping({ source: 'profile.avatar', target: 'avatar' })
  toDto(entity: UserEntity): UserDto {
    return transform(this, 'toDto', entity, UserDto);
  }

  @Mapping({ source: 'name', target: 'fullName' })
  @Mapping({ source: 'bio', target: 'profile.bio' })
  @Mapping({ source: 'avatar', target: 'profile.avatar' })
  toEntity(dto: UserDto): UserEntity {
    return transform(this, 'toEntity', dto, UserEntity);
  }
}
```

### 3. Use Mapper

```typescript
// Create mapper instance
const userMapper = new UserMapper();

// Prepare test data
const userEntity: UserEntity = {
  id: 1,
  fullName: 'John Doe',
  age: 30,
  email: 'john@example.com',
  profile: {
    bio: 'Software Developer',
    avatar: 'https://example.com/avatar.jpg',
  },
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Convert to DTO
const userDto = userMapper.toDto(userEntity);
console.log(userDto);
// Output:
// {
//   id: 1,
//   name: 'John Doe',
//   age: 30,
//   email: 'john@example.com',
//   bio: 'Software Developer',
//   avatar: 'https://example.com/avatar.jpg'
// }

// Reverse conversion
const backToEntity = userMapper.toEntity(userDto);
console.log(backToEntity);
```

## Mapping Rules

### Automatic Mapping

Fields with the same name and compatible types are automatically mapped without explicit configuration:

```typescript
// These fields are automatically mapped: id, age, email
@Mapper()
export class UserMapper {
  // Only need to configure fields with different names
  @Mapping({ source: 'fullName', target: 'name' })
  toDto(entity: UserEntity): UserDto {
    return transform(this, 'toDto', entity, UserDto);
  }
}
```

### Nested Path Mapping

Supports dot notation syntax to access nested properties:

```typescript
@Mapper()
export class UserMapper {
  @Mapping({ source: 'profile.bio', target: 'bio' })
  @Mapping({ source: 'profile.avatar', target: 'avatar' })
  @Mapping({ source: 'profile.settings.theme', target: 'theme' })
  toDto(entity: UserEntity): UserDto {
    return transform(this, 'toDto', entity, UserDto);
  }
}
```

### Batch Conversion

```typescript
@Mapper()
export class UserMapper {
  @Mapping({ source: 'fullName', target: 'name' })
  toDto(entity: UserEntity): UserDto {
    return transform(this, 'toDto', entity, UserDto);
  }

  // Batch conversion method
  toDtoList(entities: UserEntity[]): UserDto[] {
    return entities.map(entity => this.toDto(entity));
  }
}
```

## Type Safety

ts-mapper provides complete TypeScript type support:

```typescript
@Mapper()
export class UserMapper {
  // TypeScript checks if return type matches
  toDto(entity: UserEntity): UserDto {
    return transform(this, 'toDto', entity, UserDto);
  }

  // Compile-time parameter type checking
  processUser(entity: UserEntity): void {
    const dto = this.toDto(entity); // dto type is UserDto
    // TypeScript IntelliSense support
    console.log(dto.name); // ✅ Correct
    console.log(dto.fullName); // ❌ Compile error
  }
}
```

## Next Steps

- Learn about [transform() function](./transform) detailed usage
- Explore [@Mapping decorator](./mapping) advanced configuration
- Discover [custom transformation strategies](./custom-strategy)
- If you're using NestJS, check out [NestJS integration guide](../nest/getting-started)
