# ts-mapper API 文档

`@ilhamtahir/ts-mapper` 核心包提供了基础的对象映射功能。

## 装饰器

### @Mapper()

标记类为映射器，注册到元数据存储中。

```typescript
function Mapper(): ClassDecorator;
```

**示例：**

```typescript
@Mapper()
export class UserMapper {
  // 映射方法
}
```

### @Mapping(options)

定义字段映射规则。

```typescript
function Mapping(options: MappingOptions): MethodDecorator;

interface MappingOptions {
  source: string; // 源字段路径
  target: string; // 目标字段路径
}
```

**参数：**

- `source`: 源对象中的字段路径，支持点号语法访问嵌套属性
- `target`: 目标对象中的字段路径，支持点号语法设置嵌套属性

**示例：**

```typescript
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

## 核心函数

### transform()

执行对象映射转换的核心函数。

```typescript
function transform<TInput, TOutput>(
  mapper: any,
  method: string,
  input: TInput,
  outputType: new () => TOutput
): TOutput;
```

**参数：**

- `mapper`: Mapper 实例（通常是 `this`）
- `method`: 方法名称，用于获取映射元数据
- `input`: 输入对象
- `outputType`: 输出类型的构造函数

**返回值：**

- 转换后的目标对象

**示例：**

```typescript
@Mapper()
export class UserMapper {
  @Mapping({ source: 'fullName', target: 'name' })
  toDto(entity: UserEntity): UserDto {
    return transform(this, 'toDto', entity, UserDto);
  }
}
```

**工作流程：**

1. 创建目标对象实例
2. 处理显式字段映射（`@Mapping` 装饰器定义的）
3. 处理自动字段匹配（字段名相同且类型兼容的）
4. 返回转换后的对象

### createMapperProxy()

创建 Mapper 代理对象，支持抽象类和空方法体自动实现。

```typescript
function createMapperProxy<T extends object>(MapperClass: new (...args: any[]) => T): T;
```

**参数：**

- `MapperClass`: Mapper 类构造函数（支持抽象类）

**返回值：**

- 代理后的 Mapper 实例

**示例：**

```typescript
// 抽象 Mapper 类
@Mapper()
export abstract class UserMapper {
  @Mapping({ source: 'fullName', target: 'name' })
  abstract toDto(entity: UserEntity): UserDto;
}

// 创建代理实例
const mapper = createMapperProxy(UserMapper);
const dto = mapper.toDto(entity); // 自动实现
```

## 元数据管理

### metadataStorage

全局元数据存储实例，管理 Mapper 和映射规则的注册信息。

```typescript
class MetadataStorage {
  registerMapper(mapper: any): void;
  registerMapping(
    mapper: new (...args: any[]) => any,
    method: string,
    option: MappingOptions
  ): void;
  getMappings(mapper: new (...args: any[]) => any, method: string): MappingOptions[];
  getAllMappers(): (new (...args: any[]) => any)[];
}

export const metadataStorage: MetadataStorage;
```

**方法：**

#### registerMapper(mapper)

注册 Mapper 类到元数据存储。

**参数：**

- `mapper`: Mapper 类构造函数

#### registerMapping(mapper, method, option)

注册字段映射规则。

**参数：**

- `mapper`: Mapper 类构造函数
- `method`: 方法名称
- `option`: 映射选项

#### getMappings(mapper, method)

获取指定方法的映射规则。

**参数：**

- `mapper`: Mapper 类构造函数
- `method`: 方法名称

**返回值：**

- 映射规则数组

#### getAllMappers()

获取所有注册的 Mapper 类。

**返回值：**

- Mapper 类构造函数数组

**示例：**

```typescript
import { metadataStorage } from '@ilhamtahir/ts-mapper';

// 获取特定方法的映射配置
const mappings = metadataStorage.getMappings(UserMapper, 'toDto');
console.log('映射配置:', mappings);

// 获取所有注册的 Mapper
const allMappers = metadataStorage.getAllMappers();
console.log('所有 Mapper:', allMappers);
```

## 类型定义

### MappingOptions

映射选项接口。

```typescript
interface MappingOptions {
  source: string; // 源字段路径
  target: string; // 目标字段路径
}
```

## 工具函数

### getValue()

从对象中获取嵌套属性值（内部使用）。

```typescript
function getValue(obj: any, path: string): any;
```

**参数：**

- `obj`: 源对象
- `path`: 属性路径（支持点号语法）

**返回值：**

- 属性值，如果路径不存在则返回 `undefined`

**示例：**

```typescript
const obj = {
  user: {
    profile: {
      name: 'John Doe',
    },
  },
};

const name = getValue(obj, 'user.profile.name'); // 'John Doe'
const age = getValue(obj, 'user.profile.age'); // undefined
```

### setValue()

设置对象的嵌套属性值（内部使用）。

```typescript
function setValue(obj: any, path: string, value: any): void;
```

**参数：**

- `obj`: 目标对象
- `path`: 属性路径（支持点号语法）
- `value`: 要设置的值

**示例：**

```typescript
const obj = {};
setValue(obj, 'user.profile.name', 'John Doe');
// 结果: { user: { profile: { name: 'John Doe' } } }
```

## 使用示例

### 基本映射

```typescript
import { Mapper, Mapping, transform } from '@ilhamtahir/ts-mapper';

@Mapper()
export class UserMapper {
  @Mapping({ source: 'fullName', target: 'name' })
  @Mapping({ source: 'profile.bio', target: 'bio' })
  toDto(entity: UserEntity): UserDto {
    return transform(this, 'toDto', entity, UserDto);
  }
}

const mapper = new UserMapper();
const dto = mapper.toDto(entity);
```

### 抽象类映射

```typescript
import { Mapper, Mapping, createMapperProxy } from '@ilhamtahir/ts-mapper';

@Mapper()
export abstract class UserMapper {
  @Mapping({ source: 'fullName', target: 'name' })
  abstract toDto(entity: UserEntity): UserDto;

  toDtoList(entities: UserEntity[]): UserDto[] {
    return entities.map(entity => this.toDto(entity));
  }
}

const mapper = createMapperProxy(UserMapper);
const dto = mapper.toDto(entity);
const dtoList = mapper.toDtoList(entities);
```

### 自定义转换逻辑

```typescript
@Mapper()
export class UserMapper {
  @Mapping({ source: 'fullName', target: 'name' })
  toDto(entity: UserEntity): UserDto {
    const dto = transform(this, 'toDto', entity, UserDto);

    // 添加自定义逻辑
    dto.displayName = `${entity.fullName} (${entity.id})`;
    dto.age = this.calculateAge(entity.dateOfBirth);

    return dto;
  }

  private calculateAge(dateOfBirth: Date): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }
}
```

## 错误处理

### 常见错误

1. **映射元数据未找到**

   ```typescript
   // 错误：忘记添加 @Mapper() 装饰器
   export class UserMapper {
     toDto(entity: UserEntity): UserDto {
       return transform(this, 'toDto', entity, UserDto); // 抛出错误
     }
   }
   ```

2. **类型构造函数错误**

   ```typescript
   // 错误：传递了错误的类型构造函数
   return transform(this, 'toDto', entity, 'UserDto'); // 应该是 UserDto 类
   ```

3. **嵌套路径不存在**
   ```typescript
   // 安全：不会抛出错误，返回 undefined
   @Mapping({ source: 'profile.nonExistent.field', target: 'field' })
   ```

### 最佳实践

1. 始终为 Mapper 类添加 `@Mapper()` 装饰器
2. 使用 TypeScript 类型注解确保类型安全
3. 对可能为空的嵌套属性进行检查
4. 在自定义逻辑中添加适当的错误处理
5. 使用 `createMapperProxy` 处理抽象类和空方法体
