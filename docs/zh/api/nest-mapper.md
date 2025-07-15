# nest-mapper API 文档

`@ilhamtahir/nest-mapper` 是基于 `@ilhamtahir/ts-mapper` 的 NestJS 集成包，提供依赖注入和模块化支持。

## 重新导出

nest-mapper 重新导出了 ts-mapper 的所有核心功能：

```typescript
// 从 @ilhamtahir/ts-mapper 重新导出
export { Mapping, transform, metadataStorage, createMapperProxy } from '@ilhamtahir/ts-mapper';

export type { MappingOptions } from '@ilhamtahir/ts-mapper';
```

## NestJS 专用功能

### @Mapper() 装饰器

NestJS 版本的 `@Mapper()` 装饰器，自动添加 `@Injectable()` 支持依赖注入。

```typescript
function Mapper(): ClassDecorator;
```

**功能：**

1. 调用 `@Injectable()` 标记类为可注入
2. 注册到 ts-mapper 的元数据存储中

**示例：**

```typescript
import { Mapper, Mapping, transform } from '@ilhamtahir/nest-mapper';

@Mapper()
export class UserMapper {
  @Mapping({ source: 'fullName', target: 'name' })
  toDto(entity: UserEntity): UserDto {
    return transform(this, 'toDto', entity, UserDto);
  }
}
```

**与 ts-mapper 的区别：**

```typescript
// ts-mapper 版本
import { Mapper } from '@ilhamtahir/ts-mapper';

@Mapper() // 只注册元数据
export class UserMapper {
  // 需要手动创建实例
}

// nest-mapper 版本
import { Mapper } from '@ilhamtahir/nest-mapper';

@Mapper() // 注册元数据 + @Injectable()
export class UserMapper {
  // 支持依赖注入
}
```

### MapperModule

提供 Mapper 自动注册和依赖注入配置的模块。

```typescript
@Module({})
export class MapperModule {
  static forRoot(): DynamicModule;
  static forFeature(mappers: Array<new (...args: any[]) => any>): DynamicModule;
}
```

#### forRoot()

全局注册所有使用 `@Mapper()` 装饰器的类。

```typescript
static forRoot(): DynamicModule
```

**返回值：**

- 动态模块配置

**示例：**

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { MapperModule } from '@ilhamtahir/nest-mapper';

@Module({
  imports: [
    MapperModule.forRoot(), // 自动注册所有 @Mapper() 类
  ],
})
export class AppModule {}
```

**内部实现：**

```typescript
static forRoot(): DynamicModule {
  // 1. 获取所有注册的 Mapper 类
  const mapperClasses = metadataStorage.getAllMappers();

  // 2. 为每个 Mapper 创建 Provider
  const providers: Provider[] = mapperClasses.map(MapperClass => ({
    provide: MapperClass,
    useFactory: () => createMapperProxy(MapperClass),
  }));

  return {
    module: MapperModule,
    providers,
    exports: providers, // 导出供其他模块使用
  };
}
```

#### forFeature()

注册特定的 Mapper 类（用于功能模块）。

```typescript
static forFeature(mappers: Array<new (...args: any[]) => any>): DynamicModule
```

**参数：**

- `mappers`: Mapper 类构造函数数组

**返回值：**

- 动态模块配置

**示例：**

```typescript
// user.module.ts
import { Module } from '@nestjs/common';
import { MapperModule } from '@ilhamtahir/nest-mapper';
import { UserMapper } from './user.mapper';
import { ProfileMapper } from './profile.mapper';

@Module({
  imports: [MapperModule.forFeature([UserMapper, ProfileMapper])],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
```

## 依赖注入使用

### 基本注入

```typescript
import { Injectable } from '@nestjs/common';
import { UserMapper } from './user.mapper';

@Injectable()
export class UserService {
  constructor(
    private readonly userMapper: UserMapper,
    private readonly userRepository: UserRepository
  ) {}

  async getUser(id: number): Promise<UserDto> {
    const entity = await this.userRepository.findById(id);
    return this.userMapper.toDto(entity);
  }
}
```

### 多个 Mapper 注入

```typescript
@Injectable()
export class OrderService {
  constructor(
    private readonly orderMapper: OrderMapper,
    private readonly userMapper: UserMapper,
    private readonly productMapper: ProductMapper
  ) {}

  async getOrderDetails(id: number): Promise<OrderDetailDto> {
    const order = await this.orderRepository.findById(id);
    const user = await this.userRepository.findById(order.userId);
    const products = await this.productRepository.findByIds(order.productIds);

    return {
      order: this.orderMapper.toDto(order),
      user: this.userMapper.toDto(user),
      products: this.productMapper.toDtoList(products),
    };
  }
}
```

### Mapper 间依赖

```typescript
@Mapper()
export class OrderMapper {
  constructor(
    private readonly userMapper: UserMapper,
    private readonly productMapper: ProductMapper
  ) {}

  toDtoWithDetails(entity: OrderEntity): OrderDetailDto {
    const dto = transform(this, 'toDtoWithDetails', entity, OrderDetailDto);

    // 使用注入的其他 Mapper
    if (entity.user) {
      dto.user = this.userMapper.toDto(entity.user);
    }

    if (entity.products) {
      dto.products = this.productMapper.toDtoList(entity.products);
    }

    return dto;
  }
}
```

## 抽象类支持

nest-mapper 完全支持抽象类和自动实现：

```typescript
@Mapper()
export abstract class UserMapper {
  // 抽象方法：自动实现
  @Mapping({ source: 'fullName', target: 'name' })
  @Mapping({ source: 'profile.bio', target: 'bio' })
  abstract toDto(entity: UserEntity): UserDto;

  // 具体方法：保留自定义逻辑
  toDtoWithExtra(entity: UserEntity): UserDto {
    const dto = this.toDto(entity); // 调用自动实现的方法
    dto.extra = 'custom logic';
    return dto;
  }
}
```

## 循环依赖处理

### forwardRef() 支持

```typescript
@Mapper()
export class UserMapper {
  constructor(
    @Inject(forwardRef(() => PostMapper))
    private readonly postMapper: PostMapper
  ) {}

  toDto(entity: UserEntity): UserDto {
    const dto = transform(this, 'toDto', entity, UserDto);
    dto.posts = entity.posts?.map(post => this.postMapper.toBasicDto(post)) || [];
    return dto;
  }
}

@Mapper()
export class PostMapper {
  constructor(
    @Inject(forwardRef(() => UserMapper))
    private readonly userMapper: UserMapper
  ) {}

  toDto(entity: PostEntity): PostDto {
    const dto = transform(this, 'toDto', entity, PostDto);
    dto.author = this.userMapper.toBasicDto(entity.author);
    return dto;
  }
}
```

## 作用域支持

### 请求作用域

```typescript
import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
@Mapper()
export class RequestScopedMapper {
  private requestId = Math.random();

  toDto(entity: UserEntity): UserDto {
    console.log(`请求 ID: ${this.requestId}`);
    return transform(this, 'toDto', entity, UserDto);
  }
}
```

### 瞬态作用域

```typescript
@Injectable({ scope: Scope.TRANSIENT })
@Mapper()
export class TransientMapper {
  // 每次注入都创建新实例
}
```

## 测试支持

### 单元测试

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { MapperModule } from '@ilhamtahir/nest-mapper';
import { UserMapper } from './user.mapper';

describe('UserMapper', () => {
  let mapper: UserMapper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MapperModule.forRoot()],
    }).compile();

    mapper = module.get<UserMapper>(UserMapper);
  });

  it('should be defined', () => {
    expect(mapper).toBeDefined();
  });

  it('should convert entity to dto', () => {
    const entity: UserEntity = {
      id: 1,
      fullName: 'John Doe',
      profile: { bio: 'Developer', avatar: 'avatar.jpg' },
    };

    const dto = mapper.toDto(entity);

    expect(dto.id).toBe(1);
    expect(dto.name).toBe('John Doe');
    expect(dto.bio).toBe('Developer');
  });
});
```

### Mock 测试

```typescript
describe('UserService', () => {
  let service: UserService;
  let mapper: UserMapper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserMapper,
          useValue: {
            toDto: jest.fn(),
            toEntity: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    mapper = module.get<UserMapper>(UserMapper);
  });

  it('should use mapper correctly', () => {
    const entity = { id: 1, fullName: 'John Doe' };
    const expectedDto = { id: 1, name: 'John Doe' };

    jest.spyOn(mapper, 'toDto').mockReturnValue(expectedDto);

    const result = service.processUser(entity);

    expect(mapper.toDto).toHaveBeenCalledWith(entity);
    expect(result).toEqual(expectedDto);
  });
});
```

## 配置选项

### 全局配置

```typescript
// 未来可能支持的配置选项
@Module({
  imports: [
    MapperModule.forRoot({
      enableAutoMapping: true,
      strictMode: false,
      cacheEnabled: true,
    }),
  ],
})
export class AppModule {}
```

## 错误处理

### NestJS 异常集成

```typescript
import { BadRequestException } from '@nestjs/common';

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

## 最佳实践

1. **模块组织**: 在应用根模块使用 `forRoot()`，在功能模块使用 `forFeature()`
2. **依赖注入**: 充分利用 NestJS 的依赖注入系统
3. **抽象类**: 使用抽象类减少样板代码
4. **测试**: 为 Mapper 编写完整的单元测试
5. **错误处理**: 集成 NestJS 的异常处理机制
6. **性能**: 合理使用作用域和缓存策略

## 与其他 NestJS 功能集成

### 拦截器

```typescript
@Injectable()
export class MappingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => {
        // 自动应用映射逻辑
        if (data instanceof UserEntity) {
          const mapper = context.switchToHttp().getRequest().mapper;
          return mapper.toDto(data);
        }
        return data;
      })
    );
  }
}
```

### 管道

```typescript
@Injectable()
export class MappingPipe implements PipeTransform {
  constructor(private readonly userMapper: UserMapper) {}

  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type === 'body' && metadata.metatype === UserDto) {
      return this.userMapper.toEntity(value);
    }
    return value;
  }
}
```
