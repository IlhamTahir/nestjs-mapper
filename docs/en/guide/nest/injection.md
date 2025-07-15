# Mapper Dependency Injection

`@ilhamtahir/nest-mapper` fully integrates with NestJS's dependency injection system, providing automatic registration, scope management, and circular dependency handling for enterprise-grade applications.

## Automatic Registration Mechanism

### MapperModule.forRoot()

Use the `forRoot()` method to automatically discover and register all classes using the `@Mapper()` decorator:

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { MapperModule } from '@ilhamtahir/nest-mapper';

@Module({
  imports: [
    MapperModule.forRoot(), // Auto-scan and register all @Mapper() classes
  ],
})
export class AppModule {}
```

## Dependency Injection Usage

### Basic Injection

Inject Mapper in any NestJS component:

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

### Multiple Mapper Injection

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

## Scope Management

### Singleton Scope (Default)

Mappers use singleton scope by default, created once during the application lifecycle:

```typescript
@Mapper() // Default singleton scope
export class UserMapper {
  private callCount = 0;

  toDto(entity: UserEntity): UserDto {
    this.callCount++; // All injected instances share the same counter
    console.log(`Call count: ${this.callCount}`);
    return transform(this, 'toDto', entity, UserDto);
  }
}
```

### Request Scope

If you need request-level scope:

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

## Inter-Mapper Dependencies

### Mapper Injecting Other Services

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

    // Use configuration service
    if (this.configService.get('HIDE_SENSITIVE_DATA')) {
      dto.email = '***@***.com';
    }

    return dto;
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

  @Mapping({ source: 'userId', target: 'user' })
  @Mapping({ source: 'productIds', target: 'products' })
  async toDtoWithDetails(entity: OrderEntity): Promise<OrderDetailDto> {
    const dto = transform(this, 'toDtoWithDetails', entity, OrderDetailDto);

    // Use other Mappers to handle related data
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

## Testing with Dependency Injection

### Unit Testing

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

## Best Practices

1. **Single responsibility**: Each Mapper should only handle specific type mappings
2. **Minimize dependencies**: Avoid complex dependency relationships between Mappers
3. **Test-friendly**: Design Mapper interfaces that are easy to test
4. **Performance considerations**: Use caching and lazy loading appropriately
5. **Error handling**: Add appropriate error handling in Mappers

## Next Steps

- Learn about [abstract class support](./abstract-class) advanced features
- Learn how to handle [nested & circular dependencies](./circular-deps)
- Check [API documentation](../../api/nest-mapper) for complete interfaces
