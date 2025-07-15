# NestJS Getting Started

`@ilhamtahir/nestjs-mapper` is a NestJS integration package built on top of `@ilhamtahir/ts-mapper`, providing dependency injection, automatic registration, and abstract class support for enterprise-grade applications.

## Installation

::: code-group

```bash [npm]
# Install both core package and NestJS integration package
npm install @ilhamtahir/ts-mapper @ilhamtahir/nestjs-mapper
```

```bash [yarn]
yarn add @ilhamtahir/ts-mapper @ilhamtahir/nestjs-mapper
```

```bash [pnpm]
pnpm add @ilhamtahir/ts-mapper @ilhamtahir/nestjs-mapper
```

:::

## Basic Configuration

### 1. Module Configuration

Import `MapperModule` in your application module:

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { MapperModule } from '@ilhamtahir/nestjs-mapper';

@Module({
  imports: [
    MapperModule.forRoot(), // Auto-register all @Mapper() classes
  ],
  // ... other configurations
})
export class AppModule {}
```

### 2. Create Mapper

Create mapping classes using the `@Mapper()` decorator:

```typescript
// user.mapper.ts
import { Mapper, Mapping, transform } from '@ilhamtahir/nestjs-mapper';
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

  toDtoList(entities: UserEntity[]): UserDto[] {
    return entities.map(entity => this.toDto(entity));
  }
}
```

### 3. Dependency Injection Usage

Inject Mapper in services or controllers:

```typescript
// user.service.ts
import { Injectable } from '@nestjs/common';
import { UserMapper } from './user.mapper';
import { UserEntity } from './user.entity';
import { UserDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userMapper: UserMapper) {}

  async getUser(id: number): Promise<UserDto> {
    const entity = await this.userRepository.findById(id);
    return this.userMapper.toDto(entity);
  }

  async getUsers(): Promise<UserDto[]> {
    const entities = await this.userRepository.findAll();
    return this.userMapper.toDtoList(entities);
  }

  async createUser(dto: UserDto): Promise<UserDto> {
    const entity = this.userMapper.toEntity(dto);
    const savedEntity = await this.userRepository.save(entity);
    return this.userMapper.toDto(savedEntity);
  }
}
```

```typescript
// user.controller.ts
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async getUser(@Param('id') id: number): Promise<UserDto> {
    return this.userService.getUser(id);
  }

  @Get()
  async getUsers(): Promise<UserDto[]> {
    return this.userService.getUsers();
  }

  @Post()
  async createUser(@Body() dto: UserDto): Promise<UserDto> {
    return this.userService.createUser(dto);
  }
}
```

## Differences from Pure ts-mapper

### Dependency Injection Support

```typescript
// ❌ Pure ts-mapper: Manual instance creation
import { UserMapper } from './user.mapper';

const userMapper = new UserMapper();
const dto = userMapper.toDto(entity);

// ✅ nestjs-mapper: Automatic dependency injection
@Injectable()
export class UserService {
  constructor(private readonly userMapper: UserMapper) {}

  processUser(entity: UserEntity): UserDto {
    return this.userMapper.toDto(entity);
  }
}
```

### Automatic Registration

```typescript
// ❌ Pure ts-mapper: Manual instance management
const mappers = {
  user: new UserMapper(),
  product: new ProductMapper(),
  order: new OrderMapper(),
};

// ✅ nestjs-mapper: Automatic registration and management
@Module({
  imports: [MapperModule.forRoot()], // Auto-discover and register all @Mapper()
})
export class AppModule {}
```

## Real-world Example

### Complete User Management Example

```typescript
// user.entity.ts
export class UserEntity {
  id: number;
  fullName: string;
  email: string;
  age: number;
  profile: {
    bio: string;
    avatar: string;
    social: {
      twitter?: string;
      github?: string;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

// user.dto.ts
export class UserDto {
  id: number;
  name: string;
  email: string;
  age: number;
  bio: string;
  avatar: string;
  twitter?: string;
  github?: string;
}

// user.mapper.ts
@Mapper()
export class UserMapper {
  @Mapping({ source: 'fullName', target: 'name' })
  @Mapping({ source: 'profile.bio', target: 'bio' })
  @Mapping({ source: 'profile.avatar', target: 'avatar' })
  @Mapping({ source: 'profile.social.twitter', target: 'twitter' })
  @Mapping({ source: 'profile.social.github', target: 'github' })
  toDto(entity: UserEntity): UserDto {
    return transform(this, 'toDto', entity, UserDto);
  }

  @Mapping({ source: 'name', target: 'fullName' })
  @Mapping({ source: 'bio', target: 'profile.bio' })
  @Mapping({ source: 'avatar', target: 'profile.avatar' })
  @Mapping({ source: 'twitter', target: 'profile.social.twitter' })
  @Mapping({ source: 'github', target: 'profile.social.github' })
  toEntity(dto: UserDto): UserEntity {
    const entity = transform(this, 'toEntity', dto, UserEntity);
    entity.createdAt = new Date();
    entity.updatedAt = new Date();
    return entity;
  }

  toDtoList(entities: UserEntity[]): UserDto[] {
    return entities.map(entity => this.toDto(entity));
  }
}

// user.module.ts
import { Module } from '@nestjs/common';
import { MapperModule } from '@ilhamtahir/nestjs-mapper';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [MapperModule.forRoot()],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
```

## Module Scopes

### Global Registration

```typescript
// Global registration, available to all modules
@Module({
  imports: [MapperModule.forRoot()],
})
export class AppModule {}
```

### Feature Module Registration

```typescript
// Use only in specific modules
@Module({
  imports: [MapperModule.forFeature([UserMapper, ProductMapper])],
  providers: [UserService],
})
export class UserModule {}
```

## Error Handling

NestJS integration provides better error handling:

```typescript
@Mapper()
export class UserMapper {
  toDto(entity: UserEntity): UserDto {
    try {
      return transform(this, 'toDto', entity, UserDto);
    } catch (error) {
      throw new BadRequestException(`User mapping failed: ${error.message}`);
    }
  }
}
```

## Testing Support

### Unit Testing

```typescript
// user.mapper.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { MapperModule } from '@ilhamtahir/nestjs-mapper';
import { UserMapper } from './user.mapper';

describe('UserMapper', () => {
  let mapper: UserMapper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MapperModule.forRoot()],
    }).compile();

    mapper = module.get<UserMapper>(UserMapper);
  });

  it('should convert entity to dto', () => {
    const entity: UserEntity = {
      id: 1,
      fullName: 'John Doe',
      email: 'john@example.com',
      // ... other fields
    };

    const dto = mapper.toDto(entity);

    expect(dto.id).toBe(1);
    expect(dto.name).toBe('John Doe');
    expect(dto.email).toBe('john@example.com');
  });
});
```

## Performance Considerations

NestJS integration uses singleton pattern, Mapper instances are created at application startup and reused:

```typescript
// Mapper instances are created at application startup, reused for subsequent requests
@Injectable()
export class UserService {
  constructor(private readonly userMapper: UserMapper) {
    // userMapper is a singleton instance
  }
}
```

## Next Steps

- Learn about [Mapper dependency injection](./injection) advanced usage
- Explore [abstract class support](./abstract-class) features
- Learn how to handle [nested & circular dependencies](./circular-deps)
- Check [API documentation](../../api/nestjs-mapper) for complete interfaces
