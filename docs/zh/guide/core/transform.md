# transform() 函数

`transform()` 是 ts-mapper 的核心函数，负责执行实际的对象映射转换。

## 函数签名

```typescript
function transform<TInput, TOutput>(
  mapper: any,
  method: string,
  input: TInput,
  outputType: new () => TOutput
): TOutput;
```

### 参数说明

- `mapper`: Mapper 实例（通常是 `this`）
- `method`: 方法名称（用于获取映射元数据）
- `input`: 输入对象
- `outputType`: 输出类型的构造函数

## 工作原理

transform 函数按以下顺序执行映射：

### 1. 显式字段映射

首先处理通过 `@Mapping()` 装饰器定义的显式映射：

```typescript
@Mapper()
export class UserMapper {
  @Mapping({ source: 'fullName', target: 'name' })
  @Mapping({ source: 'profile.bio', target: 'bio' })
  toDto(entity: UserEntity): UserDto {
    return transform(this, 'toDto', entity, UserDto);
  }
}
```

### 2. 自动字段匹配

然后处理字段名相同且类型兼容的自动映射：

```typescript
// 这些字段会自动映射：id, age, email
const entity = { id: 1, fullName: 'John', age: 30, email: 'john@example.com' };
const dto = transform(mapper, 'toDto', entity, UserDto);
// 结果: { id: 1, name: 'John', age: 30, email: 'john@example.com' }
```

## 嵌套路径支持

transform 支持使用点号语法访问嵌套属性：

```typescript
const entity = {
  profile: {
    bio: 'Developer',
    settings: {
      theme: 'dark',
    },
  },
};

@Mapper()
export class UserMapper {
  @Mapping({ source: 'profile.bio', target: 'bio' })
  @Mapping({ source: 'profile.settings.theme', target: 'theme' })
  toDto(entity: any): any {
    return transform(this, 'toDto', entity, Object);
  }
}
```

## 类型安全

transform 函数提供完整的 TypeScript 类型推断：

```typescript
@Mapper()
export class UserMapper {
  toDto(entity: UserEntity): UserDto {
    // 返回类型自动推断为 UserDto
    return transform(this, 'toDto', entity, UserDto);
  }
}

const mapper = new UserMapper();
const entity: UserEntity = {
  /* ... */
};
const dto = mapper.toDto(entity); // dto 类型为 UserDto
```

## 错误处理

### 嵌套路径不存在

当访问不存在的嵌套路径时，transform 会安全地返回 `undefined`：

```typescript
const entity = { profile: null };

@Mapper()
export class UserMapper {
  @Mapping({ source: 'profile.bio', target: 'bio' })
  toDto(entity: any): any {
    return transform(this, 'toDto', entity, Object);
  }
}

const result = mapper.toDto(entity);
// result.bio 为 undefined，不会抛出错误
```

### 类型不匹配

TypeScript 会在编译时检查类型匹配：

```typescript
@Mapper()
export class UserMapper {
  toDto(entity: UserEntity): UserDto {
    // ✅ 正确：类型匹配
    return transform(this, 'toDto', entity, UserDto);
  }

  wrongUsage(entity: UserEntity): UserDto {
    // ❌ 编译错误：类型不匹配
    return transform(this, 'toDto', entity, string);
  }
}
```

## 性能优化

### 元数据缓存

映射元数据在首次使用时被缓存，后续调用直接使用缓存：

```typescript
const mapper = new UserMapper();

// 首次调用：解析元数据并缓存
const dto1 = mapper.toDto(entity1);

// 后续调用：直接使用缓存的元数据
const dto2 = mapper.toDto(entity2);
const dto3 = mapper.toDto(entity3);
```

### 批量转换优化

对于批量转换，建议使用数组方法而不是循环调用：

```typescript
@Mapper()
export class UserMapper {
  // ✅ 推荐：使用 map
  toDtoList(entities: UserEntity[]): UserDto[] {
    return entities.map(entity => this.toDto(entity));
  }

  // ❌ 不推荐：手动循环
  toDtoListSlow(entities: UserEntity[]): UserDto[] {
    const results: UserDto[] = [];
    for (const entity of entities) {
      results.push(this.toDto(entity));
    }
    return results;
  }
}
```

## 调试技巧

### 查看映射元数据

可以通过 metadataStorage 查看注册的映射信息：

```typescript
import { metadataStorage } from '@ilhamtahir/ts-mapper';

// 获取特定方法的映射配置
const mappings = metadataStorage.getMappings(UserMapper, 'toDto');
console.log('映射配置:', mappings);

// 获取所有注册的 Mapper
const allMappers = metadataStorage.getAllMappers();
console.log('所有 Mapper:', allMappers);
```

### 运行时检查

在开发环境中，可以添加日志来跟踪映射过程：

```typescript
@Mapper()
export class UserMapper {
  toDto(entity: UserEntity): UserDto {
    console.log('输入:', entity);
    const result = transform(this, 'toDto', entity, UserDto);
    console.log('输出:', result);
    return result;
  }
}
```

## 最佳实践

1. **明确的方法命名**: 使用清晰的方法名如 `toDto`、`toEntity`
2. **类型注解**: 始终为方法参数和返回值添加类型注解
3. **错误处理**: 对可能为空的嵌套属性进行检查
4. **性能考虑**: 对于大量数据转换，考虑使用批量方法

## 下一步

- 学习 [@Mapping 装饰器](./mapping) 的高级用法
- 了解如何实现 [自定义转换策略](./custom-strategy)
- 探索 [NestJS 集成](../nestjs/getting-started) 中的自动映射功能
