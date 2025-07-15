# nestjs-mapper API Documentation

`@ilhamtahir/nest-mapper` is a NestJS integration package built on top of `@ilhamtahir/ts-mapper`, providing dependency injection and modular support.

## Re-exports

nest-mapper re-exports all core functionality from ts-mapper:

```typescript
// Re-exported from @ilhamtahir/ts-mapper
export { Mapping, transform, metadataStorage, createMapperProxy } from '@ilhamtahir/ts-mapper';

export type { MappingOptions } from '@ilhamtahir/ts-mapper';
```

## NestJS-Specific Features

### @Mapper() Decorator

NestJS version of the `@Mapper()` decorator that automatically adds `@Injectable()` for dependency injection support.

```typescript
function Mapper(): ClassDecorator;
```

**Functionality:**

1. Calls `@Injectable()` to mark class as injectable
2. Registers to ts-mapper's metadata storage

**Example:**

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

### MapperModule

Provides Mapper auto-registration and dependency injection configuration module.

```typescript
@Module({})
export class MapperModule {
  static forRoot(): DynamicModule;
  static forFeature(mappers: Array<new (...args: any[]) => any>): DynamicModule;
}
```

#### forRoot()

Globally registers all classes using the `@Mapper()` decorator.

```typescript
static forRoot(): DynamicModule
```

**Example:**

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { MapperModule } from '@ilhamtahir/nest-mapper';

@Module({
  imports: [
    MapperModule.forRoot(), // Auto-register all @Mapper() classes
  ],
})
export class AppModule {}
```

#### forFeature()

Registers specific Mapper classes (for feature modules).

```typescript
static forFeature(mappers: Array<new (...args: any[]) => any>): DynamicModule
```

**Example:**

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

## Dependency Injection Usage

### Basic Injection

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

### Multiple Mapper Injection

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

### Inter-Mapper Dependencies

```typescript
@Mapper()
export class OrderMapper {
  constructor(
    private readonly userMapper: UserMapper,
    private readonly productMapper: ProductMapper
  ) {}

  toDtoWithDetails(entity: OrderEntity): OrderDetailDto {
    const dto = transform(this, 'toDtoWithDetails', entity, OrderDetailDto);

    // Use injected other Mappers
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

## Abstract Class Support

nest-mapper fully supports abstract classes and auto-implementation:

```typescript
@Mapper()
export abstract class UserMapper {
  // Abstract method: auto-implemented
  @Mapping({ source: 'fullName', target: 'name' })
  @Mapping({ source: 'profile.bio', target: 'bio' })
  abstract toDto(entity: UserEntity): UserDto;

  // Concrete method: preserve custom logic
  toDtoWithExtra(entity: UserEntity): UserDto {
    const dto = this.toDto(entity); // Call auto-implemented method
    dto.extra = 'custom logic';
    return dto;
  }
}
```

## Circular Dependency Handling

### forwardRef() Support

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

## Scope Support

### Request Scope

```typescript
import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
@Mapper()
export class RequestScopedMapper {
  private requestId = Math.random();

  toDto(entity: UserEntity): UserDto {
    console.log(`Request ID: ${this.requestId}`);
    return transform(this, 'toDto', entity, UserDto);
  }
}
```

## Testing Support

### Unit Testing

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

## Best Practices

1. **Module organization**: Use `forRoot()` in app root module, `forFeature()` in feature modules
2. **Dependency injection**: Make full use of NestJS's dependency injection system
3. **Abstract classes**: Use abstract classes to reduce boilerplate code
4. **Testing**: Write comprehensive unit tests for Mappers
5. **Error handling**: Integrate with NestJS exception handling mechanisms
6. **Performance**: Use scopes and caching strategies appropriately
