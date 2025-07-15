# 抽象类支持

`@ilhamtahir/nestjs-mapper` 提供了强大的抽象类支持，允许你定义抽象 Mapper 类，系统会自动实现空方法体，同时保留自定义方法的逻辑。

## 基本概念

### 传统方式 vs 抽象类方式

```typescript
// ❌ 传统方式：需要手动调用 transform
@Mapper()
export class UserMapper {
  @Mapping({ source: 'fullName', target: 'name' })
  toDto(entity: UserEntity): UserDto {
    return transform(this, 'toDto', entity, UserDto); // 手动调用
  }
}

// ✅ 抽象类方式：自动实现
@Mapper()
export abstract class UserMapper {
  @Mapping({ source: 'fullName', target: 'name' })
  abstract toDto(entity: UserEntity): UserDto; // 自动实现
}
```

## 基本用法

### 定义抽象 Mapper

```typescript
// user.mapper.ts
import { Mapper, Mapping } from '@ilhamtahir/nestjs-mapper';
import { UserEntity } from '../entities/user.entity';
import { UserDto } from '../dto/user.dto';

@Mapper()
export abstract class UserMapper {
  /**
   * 抽象方法：系统自动实现
   * 等价于调用 transform(this, 'toDto', entity, UserDto)
   */
  @Mapping({ source: 'fullName', target: 'name' })
  @Mapping({ source: 'profile.bio', target: 'bio' })
  @Mapping({ source: 'profile.avatar', target: 'avatar' })
  abstract toDto(entity: UserEntity): UserDto;

  /**
   * 抽象方法：反向映射
   */
  @Mapping({ source: 'name', target: 'fullName' })
  @Mapping({ source: 'bio', target: 'profile.bio' })
  @Mapping({ source: 'avatar', target: 'profile.avatar' })
  abstract toEntity(dto: UserDto): UserEntity;

  /**
   * 具体方法：保留自定义逻辑
   */
  toDtoList(entities: UserEntity[]): UserDto[] {
    return entities.map(entity => this.toDto(entity));
  }

  /**
   * 具体方法：带额外逻辑的转换
   */
  toDtoWithExtra(entity: UserEntity): UserDto {
    const dto = this.toDto(entity); // 调用自动实现的方法
    dto.displayName = `${dto.name} (ID: ${dto.id})`;
    dto.isActive = entity.status === 'active';
    return dto;
  }
}
```

## 空方法体支持

由于 TypeScript 的限制，抽象方法不能直接使用装饰器。作为替代方案，你可以使用空方法体：

```typescript
@Mapper()
export class UserMapper {
  /**
   * 空方法体：系统会自动调用 transform
   * 返回值会被忽略，系统使用 transform 的结果
   */
  @Mapping({ source: 'fullName', target: 'name' })
  @Mapping({ source: 'profile.bio', target: 'bio' })
  toDto(_entity: UserEntity): UserDto {
    // 空方法体或返回占位符，系统会自动调用 transform
    return {} as UserDto;
  }

  /**
   * 具体实现：保留自定义逻辑
   */
  toDtoWithValidation(entity: UserEntity): UserDto {
    if (!entity.fullName) {
      throw new Error('用户名不能为空');
    }

    const dto = this.toDto(entity);
    dto.validated = true;
    return dto;
  }
}
```

## 工作原理

### Proxy 自动实现

系统使用 `createMapperProxy` 创建代理对象：

```typescript
// 内部实现原理（简化版）
export function createMapperProxy<T>(MapperClass: new () => T): T {
  const instance = new MapperClass();

  return new Proxy(instance, {
    get(target, propKey, receiver) {
      const original = Reflect.get(target, propKey, receiver);

      if (typeof original === 'function') {
        return function (...args: any[]) {
          // 检查是否为空方法体或抽象方法
          if (isEmptyOrAbstractMethod(original, target, propKey)) {
            // 自动执行 transform
            return executeAutoTransform(target, String(propKey), args[0]);
          } else {
            // 保留原始方法逻辑
            return original.apply(this, args);
          }
        };
      }

      return original;
    },
  });
}
```

### 方法检测逻辑

```typescript
function isEmptyOrAbstractMethod(method: Function, target: any, propKey: PropertyKey): boolean {
  // 1. 检查是否为抽象方法（在抽象类中未实现）
  if (method === undefined) {
    return true;
  }

  // 2. 检查方法体是否为空或只包含占位符代码
  const methodString = method.toString();
  const bodyMatch = methodString.match(/\{([\s\S]*)\}/);

  if (bodyMatch) {
    const body = bodyMatch[1].trim();
    // 空方法体或只包含注释、return {} as Type 等占位符
    return (
      body === '' ||
      body.match(/^\/\*[\s\S]*\*\/\s*$/) ||
      body.match(/^return\s+\{\}\s+as\s+\w+;?\s*$/)
    );
  }

  return false;
}
```

## 混合模式示例

### 部分自动，部分自定义

```typescript
@Mapper()
export abstract class UserMapper {
  // 自动实现的简单映射
  @Mapping({ source: 'fullName', target: 'name' })
  @Mapping({ source: 'profile.bio', target: 'bio' })
  abstract toDto(entity: UserEntity): UserDto;

  // 自定义实现的复杂映射
  toDtoWithCalculations(entity: UserEntity): UserDto {
    const dto = this.toDto(entity); // 使用自动实现的方法

    // 添加计算字段
    dto.age = this.calculateAge(entity.dateOfBirth);
    dto.membershipLevel = this.calculateMembershipLevel(entity);
    dto.permissions = this.getUserPermissions(entity.roles);

    return dto;
  }

  // 批量转换
  toDtoList(entities: UserEntity[]): UserDto[] {
    return entities.map(entity => this.toDto(entity));
  }

  // 带验证的转换
  toDtoWithValidation(entity: UserEntity): UserDto {
    this.validateEntity(entity);
    return this.toDto(entity);
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

  private calculateMembershipLevel(entity: UserEntity): string {
    // 复杂的会员等级计算逻辑
    if (entity.totalSpent > 10000) return 'platinum';
    if (entity.totalSpent > 5000) return 'gold';
    if (entity.totalSpent > 1000) return 'silver';
    return 'bronze';
  }

  private getUserPermissions(roles: string[]): string[] {
    // 根据角色计算权限
    const permissions = new Set<string>();

    roles.forEach(role => {
      switch (role) {
        case 'admin':
          permissions.add('read').add('write').add('delete');
          break;
        case 'editor':
          permissions.add('read').add('write');
          break;
        case 'viewer':
          permissions.add('read');
          break;
      }
    });

    return Array.from(permissions);
  }

  private validateEntity(entity: UserEntity): void {
    if (!entity.fullName || entity.fullName.trim().length === 0) {
      throw new Error('用户名不能为空');
    }

    if (!entity.email || !this.isValidEmail(entity.email)) {
      throw new Error('邮箱格式不正确');
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
```

## 实际应用场景

### 复杂业务映射

```typescript
@Mapper()
export abstract class OrderMapper {
  // 基本订单映射（自动实现）
  @Mapping({ source: 'orderNumber', target: 'number' })
  @Mapping({ source: 'customer.name', target: 'customerName' })
  @Mapping({ source: 'items', target: 'orderItems' })
  abstract toDto(entity: OrderEntity): OrderDto;

  // 带计算的订单摘要
  toSummaryDto(entity: OrderEntity): OrderSummaryDto {
    const dto = this.toDto(entity);

    return {
      ...dto,
      totalAmount: this.calculateTotal(entity.items),
      itemCount: entity.items.length,
      status: this.getDisplayStatus(entity.status),
      estimatedDelivery: this.calculateDeliveryDate(entity.createdAt),
    };
  }

  // 带权限检查的详细信息
  toDetailDto(entity: OrderEntity, userRole: string): OrderDetailDto {
    const dto = this.toDto(entity);

    // 根据用户角色显示不同信息
    if (userRole === 'customer') {
      // 客户只能看到基本信息
      return {
        ...dto,
        canCancel: entity.status === 'pending',
        canModify: false,
      };
    } else if (userRole === 'admin') {
      // 管理员可以看到所有信息
      return {
        ...dto,
        internalNotes: entity.internalNotes,
        cost: entity.cost,
        profit: entity.totalAmount - entity.cost,
        canCancel: true,
        canModify: true,
      };
    }

    return dto;
  }

  private calculateTotal(items: OrderItem[]): number {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  private getDisplayStatus(status: string): string {
    const statusMap = {
      'pending': '待处理',
      'processing': '处理中',
      'shipped': '已发货',
      'delivered': '已送达',
      'cancelled': '已取消',
    };
    return statusMap[status] || status;
  }

  private calculateDeliveryDate(orderDate: Date): Date {
    const deliveryDate = new Date(orderDate);
    deliveryDate.setDate(deliveryDate.getDate() + 3); // 3天后送达
    return deliveryDate;
  }
}
```

## 类型安全

抽象类支持完整的 TypeScript 类型检查：

```typescript
@Mapper()
export abstract class TypeSafeMapper {
  // TypeScript 会检查参数和返回类型
  abstract toDto(entity: UserEntity): UserDto;

  // 编译时类型检查
  processUser(entity: UserEntity): UserDto {
    const dto = this.toDto(entity); // dto 类型为 UserDto

    // ✅ 正确：UserDto 有 name 属性
    console.log(dto.name);

    // ❌ 编译错误：UserDto 没有 fullName 属性
    // console.log(dto.fullName);

    return dto;
  }
}
```

## 测试支持

### 测试抽象 Mapper

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

  it('should auto-implement abstract methods', () => {
    const entity: UserEntity = {
      id: 1,
      fullName: 'John Doe',
      profile: {
        bio: 'Developer',
        avatar: 'avatar.jpg',
      },
    };

    const dto = mapper.toDto(entity);

    expect(dto.id).toBe(1);
    expect(dto.name).toBe('John Doe'); // fullName -> name 映射
    expect(dto.bio).toBe('Developer'); // profile.bio -> bio 映射
  });

  it('should preserve custom method logic', () => {
    const entity: UserEntity = {
      id: 1,
      fullName: 'John Doe',
      dateOfBirth: new Date('1990-01-01'),
      totalSpent: 5500,
    };

    const dto = mapper.toDtoWithCalculations(entity);

    expect(dto.name).toBe('John Doe');
    expect(dto.age).toBeGreaterThan(30);
    expect(dto.membershipLevel).toBe('gold');
  });
});
```

## 最佳实践

1. **清晰的方法分离**: 将自动映射和自定义逻辑分离到不同方法
2. **类型注解**: 为抽象方法提供完整的类型注解
3. **文档注释**: 为抽象方法添加清晰的文档说明
4. **测试覆盖**: 测试自动实现和自定义逻辑
5. **性能考虑**: 避免在自定义方法中重复调用自动映射

## 下一步

- 学习如何处理 [嵌套与循环依赖](./circular-deps)
- 查看 [API 文档](../../api/nestjs-mapper) 了解完整接口
- 探索 [核心功能](../core/getting-started) 的高级用法
