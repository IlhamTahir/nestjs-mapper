# Mapper 依赖注入

`@ilhamtahir/nestjs-mapper` 完全集成了 NestJS 的依赖注入系统，提供自动注册、作用域管理和循环依赖处理等企业级功能。

## 自动注册机制

### MapperModule.forRoot()

使用 `forRoot()` 方法自动发现并注册所有使用 `@Mapper()` 装饰器的类：

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { MapperModule } from '@ilhamtahir/nestjs-mapper';

@Module({
  imports: [
    MapperModule.forRoot(), // 自动扫描并注册所有 @Mapper() 类
  ],
})
export class AppModule {}
```

### 工作原理

```typescript
// 内部实现原理（简化版）
@Module({})
export class MapperModule {
  static forRoot(): DynamicModule {
    // 1. 获取所有注册的 Mapper 类
    const mapperClasses = metadataStorage.getAllMappers();

    // 2. 为每个 Mapper 创建 Provider
    const providers: Provider[] = mapperClasses.map(MapperClass => ({
      provide: MapperClass,
      useFactory: () => createMapperProxy(MapperClass), // 创建代理实例
    }));

    return {
      module: MapperModule,
      providers,
      exports: providers, // 导出供其他模块使用
    };
  }
}
```

## 依赖注入使用

### 基本注入

在任何 NestJS 组件中注入 Mapper：

```typescript
// user.service.ts
import { Injectable } from '@nestjs/common';
import { UserMapper } from './mappers/user.mapper';

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

  async getOrderWithDetails(id: number): Promise<OrderDetailDto> {
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

## 作用域管理

### 单例作用域（默认）

Mapper 默认使用单例作用域，在整个应用生命周期中只创建一次：

```typescript
@Mapper() // 默认为单例作用域
export class UserMapper {
  private callCount = 0;

  toDto(entity: UserEntity): UserDto {
    this.callCount++; // 所有注入的实例共享同一个计数器
    console.log(`调用次数: ${this.callCount}`);
    return transform(this, 'toDto', entity, UserDto);
  }
}
```

### 请求作用域

如果需要请求级别的作用域：

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

## 条件注册

### 环境条件注册

```typescript
// mapper.module.ts
import { Module, DynamicModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Module({})
export class CustomMapperModule {
  static forRoot(): DynamicModule {
    const providers = [];

    // 根据环境条件注册不同的 Mapper
    if (process.env.NODE_ENV === 'development') {
      providers.push({
        provide: UserMapper,
        useClass: DevUserMapper, // 开发环境使用特殊的 Mapper
      });
    } else {
      providers.push({
        provide: UserMapper,
        useFactory: () => createMapperProxy(UserMapper),
      });
    }

    return {
      module: CustomMapperModule,
      providers,
      exports: providers,
    };
  }
}
```

### 功能开关

```typescript
@Module({})
export class FeatureMapperModule {
  static forRoot(config: { enableAdvancedMapping?: boolean }): DynamicModule {
    const providers = [
      {
        provide: UserMapper,
        useFactory: () => createMapperProxy(UserMapper),
      },
    ];

    if (config.enableAdvancedMapping) {
      providers.push({
        provide: AdvancedUserMapper,
        useFactory: () => createMapperProxy(AdvancedUserMapper),
      });
    }

    return {
      module: FeatureMapperModule,
      providers,
      exports: providers,
    };
  }
}
```

## Mapper 间依赖

### Mapper 注入其他服务

```typescript
@Mapper()
export class UserMapper {
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: Logger
  ) {}

  toDto(entity: UserEntity): UserDto {
    this.logger.log('Converting user entity to DTO');

    const dto = transform(this, 'toDto', entity, UserDto);

    // 使用配置服务
    if (this.configService.get('HIDE_SENSITIVE_DATA')) {
      dto.email = '***@***.com';
    }

    return dto;
  }
}
```

### Mapper 间相互依赖

```typescript
@Mapper()
export class OrderMapper {
  constructor(
    private readonly userMapper: UserMapper,
    private readonly productMapper: ProductMapper
  ) {}

  @Mapping({ source: 'userId', target: 'user' })
  @Mapping({ source: 'productIds', target: 'products' })
  async toDtoWithDetails(entity: OrderEntity): Promise<OrderDetailDto> {
    const dto = transform(this, 'toDtoWithDetails', entity, OrderDetailDto);

    // 使用其他 Mapper 处理关联数据
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

## 模块化组织

### 功能模块

```typescript
// user/user.module.ts
@Module({
  imports: [MapperModule.forRoot()],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}

// product/product.module.ts
@Module({
  imports: [MapperModule.forRoot()],
  providers: [ProductService],
  controllers: [ProductController],
  exports: [ProductService],
})
export class ProductModule {}

// app.module.ts
@Module({
  imports: [
    UserModule,
    ProductModule,
    // MapperModule 在各个功能模块中独立导入
  ],
})
export class AppModule {}
```

### 共享 Mapper 模块

```typescript
// shared/mapper.module.ts
@Module({
  imports: [MapperModule.forRoot()],
  exports: [MapperModule], // 导出供其他模块使用
})
export class SharedMapperModule {}

// user/user.module.ts
@Module({
  imports: [SharedMapperModule], // 导入共享的 Mapper 模块
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
```

## 测试中的依赖注入

### 单元测试

```typescript
// user.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserMapper } from './user.mapper';

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

  it('should convert entity to dto', () => {
    const entity = { id: 1, fullName: 'John Doe' };
    const expectedDto = { id: 1, name: 'John Doe' };

    jest.spyOn(mapper, 'toDto').mockReturnValue(expectedDto);

    const result = service.processUser(entity);

    expect(mapper.toDto).toHaveBeenCalledWith(entity);
    expect(result).toEqual(expectedDto);
  });
});
```

### 集成测试

```typescript
// user.integration.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { MapperModule } from '@ilhamtahir/nestjs-mapper';
import { UserService } from './user.service';
import { UserMapper } from './user.mapper';

describe('UserService Integration', () => {
  let service: UserService;
  let mapper: UserMapper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MapperModule.forRoot()], // 使用真实的 Mapper
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
    mapper = module.get<UserMapper>(UserMapper);
  });

  it('should perform real mapping', () => {
    const entity: UserEntity = {
      id: 1,
      fullName: 'John Doe',
      email: 'john@example.com',
      profile: {
        bio: 'Developer',
        avatar: 'avatar.jpg',
      },
    };

    const dto = mapper.toDto(entity);

    expect(dto.id).toBe(1);
    expect(dto.name).toBe('John Doe');
    expect(dto.bio).toBe('Developer');
  });
});
```

## 性能优化

### 懒加载

```typescript
// 懒加载 Mapper，只在需要时创建
@Injectable()
export class LazyUserService {
  constructor(private readonly moduleRef: ModuleRef) {}

  async processUser(entity: UserEntity): Promise<UserDto> {
    const userMapper = await this.moduleRef.get(UserMapper, { strict: false });
    return userMapper.toDto(entity);
  }
}
```

### 缓存优化

```typescript
@Mapper()
export class CachedUserMapper {
  private cache = new Map<string, UserDto>();

  toDto(entity: UserEntity): UserDto {
    const cacheKey = `user-${entity.id}-${entity.updatedAt.getTime()}`;

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const dto = transform(this, 'toDto', entity, UserDto);
    this.cache.set(cacheKey, dto);

    return dto;
  }
}
```

## 最佳实践

1. **单一职责**: 每个 Mapper 只负责特定类型的映射
2. **依赖最小化**: 避免 Mapper 间的复杂依赖关系
3. **测试友好**: 设计易于测试的 Mapper 接口
4. **性能考虑**: 合理使用缓存和懒加载
5. **错误处理**: 在 Mapper 中添加适当的错误处理

## 下一步

- 了解 [抽象类支持](./abstract-class) 的高级功能
- 学习如何处理 [嵌套与循环依赖](./circular-deps)
- 查看 [API 文档](../../api/nestjs-mapper) 了解完整接口
