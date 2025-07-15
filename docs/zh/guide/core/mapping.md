# @Mapping 装饰器

`@Mapping` 装饰器用于定义显式的字段映射规则，支持字段重命名、嵌套路径访问等高级功能。

## 基本语法

```typescript
@Mapping({ source: 'sourceField', target: 'targetField' })
```

### 参数说明

```typescript
interface MappingOptions {
  source: string; // 源字段路径
  target: string; // 目标字段路径
}
```

## 基本用法

### 字段重命名

最常见的用法是将不同名的字段进行映射：

```typescript
@Mapper()
export class UserMapper {
  @Mapping({ source: 'fullName', target: 'name' })
  @Mapping({ source: 'emailAddress', target: 'email' })
  toDto(entity: UserEntity): UserDto {
    return transform(this, 'toDto', entity, UserDto);
  }
}
```

### 多个映射规则

一个方法可以有多个 `@Mapping` 装饰器：

```typescript
@Mapper()
export class UserMapper {
  @Mapping({ source: 'firstName', target: 'name' })
  @Mapping({ source: 'profile.bio', target: 'bio' })
  @Mapping({ source: 'profile.avatar', target: 'avatar' })
  @Mapping({ source: 'settings.theme', target: 'theme' })
  toDto(entity: UserEntity): UserDto {
    return transform(this, 'toDto', entity, UserDto);
  }
}
```

## 嵌套路径映射

### 从嵌套对象提取字段

使用点号语法访问嵌套属性：

```typescript
// 源数据结构
interface UserEntity {
  id: number;
  profile: {
    personal: {
      firstName: string;
      lastName: string;
    };
    contact: {
      email: string;
      phone: string;
    };
  };
}

// 目标数据结构
interface UserDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

@Mapper()
export class UserMapper {
  @Mapping({ source: 'profile.personal.firstName', target: 'firstName' })
  @Mapping({ source: 'profile.personal.lastName', target: 'lastName' })
  @Mapping({ source: 'profile.contact.email', target: 'email' })
  @Mapping({ source: 'profile.contact.phone', target: 'phone' })
  toDto(entity: UserEntity): UserDto {
    return transform(this, 'toDto', entity, UserDto);
  }
}
```

### 映射到嵌套对象

也可以将平面字段映射到嵌套结构：

```typescript
// 源数据结构
interface UserDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

// 目标数据结构
interface UserEntity {
  id: number;
  profile: {
    name: {
      first: string;
      last: string;
    };
    contact: {
      email: string;
    };
  };
}

@Mapper()
export class UserMapper {
  @Mapping({ source: 'firstName', target: 'profile.name.first' })
  @Mapping({ source: 'lastName', target: 'profile.name.last' })
  @Mapping({ source: 'email', target: 'profile.contact.email' })
  toEntity(dto: UserDto): UserEntity {
    return transform(this, 'toEntity', dto, UserEntity);
  }
}
```

## 实际应用示例

### 用户信息映射

```typescript
// 实体类
export class UserEntity {
  id: number;
  fullName: string;
  dateOfBirth: Date;
  profile: {
    bio: string;
    avatar: string;
    social: {
      twitter: string;
      github: string;
    };
  };
  settings: {
    theme: 'light' | 'dark';
    notifications: boolean;
  };
}

// DTO 类
export class UserDto {
  id: number;
  name: string;
  age: number;
  bio: string;
  avatar: string;
  twitter: string;
  github: string;
  theme: string;
  notifications: boolean;
}

@Mapper()
export class UserMapper {
  @Mapping({ source: 'fullName', target: 'name' })
  @Mapping({ source: 'profile.bio', target: 'bio' })
  @Mapping({ source: 'profile.avatar', target: 'avatar' })
  @Mapping({ source: 'profile.social.twitter', target: 'twitter' })
  @Mapping({ source: 'profile.social.github', target: 'github' })
  @Mapping({ source: 'settings.theme', target: 'theme' })
  @Mapping({ source: 'settings.notifications', target: 'notifications' })
  toDto(entity: UserEntity): UserDto {
    const dto = transform(this, 'toDto', entity, UserDto);

    // 自定义逻辑：计算年龄
    if (entity.dateOfBirth) {
      const today = new Date();
      const birthDate = new Date(entity.dateOfBirth);
      dto.age = today.getFullYear() - birthDate.getFullYear();
    }

    return dto;
  }
}
```

### 双向映射

```typescript
@Mapper()
export class UserMapper {
  // Entity -> DTO
  @Mapping({ source: 'fullName', target: 'name' })
  @Mapping({ source: 'profile.bio', target: 'bio' })
  @Mapping({ source: 'profile.avatar', target: 'avatar' })
  toDto(entity: UserEntity): UserDto {
    return transform(this, 'toDto', entity, UserDto);
  }

  // DTO -> Entity (反向映射)
  @Mapping({ source: 'name', target: 'fullName' })
  @Mapping({ source: 'bio', target: 'profile.bio' })
  @Mapping({ source: 'avatar', target: 'profile.avatar' })
  toEntity(dto: UserDto): UserEntity {
    const entity = transform(this, 'toEntity', dto, UserEntity);

    // 设置默认值
    entity.createdAt = new Date();
    entity.updatedAt = new Date();

    return entity;
  }
}
```

## 错误处理

### 路径不存在

当源路径不存在时，目标字段会被设置为 `undefined`：

```typescript
const entity = {
  id: 1,
  profile: null, // profile 为 null
};

@Mapper()
export class UserMapper {
  @Mapping({ source: 'profile.bio', target: 'bio' })
  toDto(entity: any): any {
    return transform(this, 'toDto', entity, Object);
  }
}

const result = mapper.toDto(entity);
// result.bio 为 undefined
```

### 类型安全检查

TypeScript 会在编译时检查路径的有效性：

```typescript
@Mapper()
export class UserMapper {
  // ✅ 正确：路径存在
  @Mapping({ source: 'profile.bio', target: 'bio' })
  toDto(entity: UserEntity): UserDto {
    return transform(this, 'toDto', entity, UserDto);
  }

  // ❌ 编译警告：路径可能不存在
  @Mapping({ source: 'profile.nonExistentField', target: 'bio' })
  wrongMapping(entity: UserEntity): UserDto {
    return transform(this, 'wrongMapping', entity, UserDto);
  }
}
```

## 最佳实践

### 1. 清晰的映射规则

```typescript
// ✅ 推荐：清晰的字段映射
@Mapping({ source: 'user.personalInfo.fullName', target: 'displayName' })
@Mapping({ source: 'user.contactInfo.primaryEmail', target: 'email' })

// ❌ 不推荐：不清晰的映射
@Mapping({ source: 'u.p.n', target: 'n' })
```

### 2. 分组相关映射

```typescript
@Mapper()
export class UserMapper {
  // 基本信息映射
  @Mapping({ source: 'fullName', target: 'name' })
  @Mapping({ source: 'dateOfBirth', target: 'birthDate' })

  // 联系信息映射
  @Mapping({ source: 'contact.email', target: 'email' })
  @Mapping({ source: 'contact.phone', target: 'phone' })

  // 个人资料映射
  @Mapping({ source: 'profile.bio', target: 'bio' })
  @Mapping({ source: 'profile.avatar', target: 'avatar' })
  toDto(entity: UserEntity): UserDto {
    return transform(this, 'toDto', entity, UserDto);
  }
}
```

### 3. 文档注释

```typescript
@Mapper()
export class UserMapper {
  /**
   * 将用户实体转换为 DTO
   * - fullName -> name: 用户显示名称
   * - profile.bio -> bio: 个人简介
   * - profile.avatar -> avatar: 头像 URL
   */
  @Mapping({ source: 'fullName', target: 'name' })
  @Mapping({ source: 'profile.bio', target: 'bio' })
  @Mapping({ source: 'profile.avatar', target: 'avatar' })
  toDto(entity: UserEntity): UserDto {
    return transform(this, 'toDto', entity, UserDto);
  }
}
```

## 下一步

- 了解 [自定义转换策略](./custom-strategy) 实现复杂映射逻辑
- 探索 [NestJS 集成](../nestjs/getting-started) 中的依赖注入功能
- 查看 [API 文档](../../api/ts-mapper) 了解完整的接口定义
