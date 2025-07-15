# 快速开始

`@ilhamtahir/ts-mapper` 是一个轻量级的 TypeScript 对象映射库，提供类型安全的 DTO ↔ Entity 转换功能。

## 安装

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

## TypeScript 配置

确保你的 `tsconfig.json` 启用了装饰器支持：

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

## 基本使用

### 1. 定义数据模型

首先定义你的实体类和 DTO 类：

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
  name: string; // 对应 entity.fullName
  age: number;
  email: string;
  bio: string; // 对应 entity.profile.bio
  avatar: string; // 对应 entity.profile.avatar
}
```

### 2. 创建 Mapper

使用 `@Mapper()` 装饰器标记映射类，使用 `@Mapping()` 装饰器定义字段映射规则：

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

### 3. 使用 Mapper

```typescript
// 创建 mapper 实例
const userMapper = new UserMapper();

// 准备测试数据
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

// 转换为 DTO
const userDto = userMapper.toDto(userEntity);
console.log(userDto);
// 输出:
// {
//   id: 1,
//   name: 'John Doe',
//   age: 30,
//   email: 'john@example.com',
//   bio: 'Software Developer',
//   avatar: 'https://example.com/avatar.jpg'
// }

// 反向转换
const backToEntity = userMapper.toEntity(userDto);
console.log(backToEntity);
```

## 映射规则

### 自动映射

字段名相同且类型兼容的属性会自动映射，无需显式配置：

```typescript
// 这些字段会自动映射：id, age, email
@Mapper()
export class UserMapper {
  // 只需要配置不同名的字段
  @Mapping({ source: 'fullName', target: 'name' })
  toDto(entity: UserEntity): UserDto {
    return transform(this, 'toDto', entity, UserDto);
  }
}
```

### 嵌套路径映射

支持使用点号语法访问嵌套属性：

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

### 批量转换

```typescript
@Mapper()
export class UserMapper {
  @Mapping({ source: 'fullName', target: 'name' })
  toDto(entity: UserEntity): UserDto {
    return transform(this, 'toDto', entity, UserDto);
  }

  // 批量转换方法
  toDtoList(entities: UserEntity[]): UserDto[] {
    return entities.map(entity => this.toDto(entity));
  }
}
```

## 类型安全

ts-mapper 提供完整的 TypeScript 类型支持：

```typescript
@Mapper()
export class UserMapper {
  // TypeScript 会检查返回类型是否匹配
  toDto(entity: UserEntity): UserDto {
    return transform(this, 'toDto', entity, UserDto);
  }

  // 编译时会检查参数类型
  processUser(entity: UserEntity): void {
    const dto = this.toDto(entity); // dto 类型为 UserDto
    // TypeScript IntelliSense 支持
    console.log(dto.name); // ✅ 正确
    console.log(dto.fullName); // ❌ 编译错误
  }
}
```

## 下一步

- 了解 [transform() 函数](./transform) 的详细用法
- 学习 [@Mapping 装饰器](./mapping) 的高级配置
- 探索 [自定义转换策略](./custom-strategy)
- 如果你使用 NestJS，查看 [NestJS 集成指南](../nest/getting-started)
