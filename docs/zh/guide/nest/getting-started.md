# NestJS 快速开始

`@ilhamtahir/nestjs-mapper` 是基于 `@ilhamtahir/ts-mapper` 的 NestJS 集成包，提供依赖注入、自动注册和抽象类支持等企业级功能。

## 安装

::: code-group

```bash [npm]
# 同时安装核心包和 NestJS 集成包
npm install @ilhamtahir/ts-mapper @ilhamtahir/nestjs-mapper
```

```bash [yarn]
yarn add @ilhamtahir/ts-mapper @ilhamtahir/nestjs-mapper
```

```bash [pnpm]
pnpm add @ilhamtahir/ts-mapper @ilhamtahir/nestjs-mapper
```

:::

## 基本配置

### 1. 模块配置

在你的应用模块中导入 `MapperModule`：

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { MapperModule } from '@ilhamtahir/nestjs-mapper';

@Module({
  imports: [
    MapperModule.forRoot(), // 自动注册所有 @Mapper() 类
  ],
  // ... 其他配置
})
export class AppModule {}
```

### 2. 创建 Mapper

使用 `@Mapper()` 装饰器创建映射类：

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

### 3. 依赖注入使用

在服务或控制器中注入 Mapper：

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

## 与纯 ts-mapper 的区别

### 依赖注入支持

```typescript
// ❌ 纯 ts-mapper：手动创建实例
import { UserMapper } from './user.mapper';

const userMapper = new UserMapper();
const dto = userMapper.toDto(entity);

// ✅ nestjs-mapper：自动依赖注入
@Injectable()
export class UserService {
  constructor(private readonly userMapper: UserMapper) {}

  processUser(entity: UserEntity): UserDto {
    return this.userMapper.toDto(entity);
  }
}
```

### 自动注册

```typescript
// ❌ 纯 ts-mapper：需要手动管理实例
const mappers = {
  user: new UserMapper(),
  product: new ProductMapper(),
  order: new OrderMapper(),
};

// ✅ nestjs-mapper：自动注册和管理
@Module({
  imports: [MapperModule.forRoot()], // 自动发现并注册所有 @Mapper()
})
export class AppModule {}
```

## 实际应用示例

### 完整的用户管理示例

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

## 模块作用域

### 全局注册

```typescript
// 全局注册，所有模块都可以使用
@Module({
  imports: [MapperModule.forRoot()],
})
export class AppModule {}
```

### 特定模块注册

```typescript
// 只在特定模块中使用
@Module({
  imports: [MapperModule.forFeature([UserMapper, ProductMapper])],
  providers: [UserService],
})
export class UserModule {}
```

## 错误处理

NestJS 集成提供了更好的错误处理：

```typescript
@Mapper()
export class UserMapper {
  toDto(entity: UserEntity): UserDto {
    try {
      return transform(this, 'toDto', entity, UserDto);
    } catch (error) {
      throw new BadRequestException(`用户映射失败: ${error.message}`);
    }
  }
}
```

## 测试支持

### 单元测试

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
      // ... 其他字段
    };

    const dto = mapper.toDto(entity);

    expect(dto.id).toBe(1);
    expect(dto.name).toBe('John Doe');
    expect(dto.email).toBe('john@example.com');
  });
});
```

## 性能考虑

NestJS 集成使用单例模式，Mapper 实例在应用启动时创建并复用：

```typescript
// Mapper 实例在应用启动时创建，后续请求复用同一实例
@Injectable()
export class UserService {
  constructor(private readonly userMapper: UserMapper) {
    // userMapper 是单例实例
  }
}
```

## 下一步

- 了解 [Mapper 依赖注入](./injection) 的高级用法
- 探索 [抽象类支持](./abstract-class) 功能
- 学习如何处理 [嵌套与循环依赖](./circular-deps)
- 查看 [API 文档](../../api/nestjs-mapper) 了解完整接口
