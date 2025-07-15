# Abstract Class Support

`@ilhamtahir/nestjs-mapper` provides powerful abstract class support, allowing you to define abstract Mapper classes where the system automatically implements empty method bodies while preserving custom method logic.

## Basic Concept

### Traditional vs Abstract Class Approach

```typescript
// ❌ Traditional approach: manual transform calls
@Mapper()
export class UserMapper {
  @Mapping({ source: 'fullName', target: 'name' })
  toDto(entity: UserEntity): UserDto {
    return transform(this, 'toDto', entity, UserDto); // Manual call
  }
}

// ✅ Abstract class approach: auto-implementation
@Mapper()
export abstract class UserMapper {
  @Mapping({ source: 'fullName', target: 'name' })
  abstract toDto(entity: UserEntity): UserDto; // Auto-implemented
}
```

## Basic Usage

### Define Abstract Mapper

```typescript
// user.mapper.ts
import { Mapper, Mapping } from '@ilhamtahir/nestjs-mapper';
import { UserEntity } from '../entities/user.entity';
import { UserDto } from '../dto/user.dto';

@Mapper()
export abstract class UserMapper {
  /**
   * Abstract method: automatically implemented by system
   * Equivalent to calling transform(this, 'toDto', entity, UserDto)
   */
  @Mapping({ source: 'fullName', target: 'name' })
  @Mapping({ source: 'profile.bio', target: 'bio' })
  @Mapping({ source: 'profile.avatar', target: 'avatar' })
  abstract toDto(entity: UserEntity): UserDto;

  /**
   * Abstract method: reverse mapping
   */
  @Mapping({ source: 'name', target: 'fullName' })
  @Mapping({ source: 'bio', target: 'profile.bio' })
  @Mapping({ source: 'avatar', target: 'profile.avatar' })
  abstract toEntity(dto: UserDto): UserEntity;

  /**
   * Concrete method: preserve custom logic
   */
  toDtoList(entities: UserEntity[]): UserDto[] {
    return entities.map(entity => this.toDto(entity));
  }

  /**
   * Concrete method: transformation with extra logic
   */
  toDtoWithExtra(entity: UserEntity): UserDto {
    const dto = this.toDto(entity); // Call auto-implemented method
    dto.displayName = `${dto.name} (ID: ${dto.id})`;
    dto.isActive = entity.status === 'active';
    return dto;
  }
}
```

## Empty Method Body Support

Due to TypeScript limitations, abstract methods cannot directly use decorators. As an alternative, you can use empty method bodies:

```typescript
@Mapper()
export class UserMapper {
  /**
   * Empty method body: system will automatically call transform
   * Return value is ignored, system uses transform result
   */
  @Mapping({ source: 'fullName', target: 'name' })
  @Mapping({ source: 'profile.bio', target: 'bio' })
  toDto(_entity: UserEntity): UserDto {
    // Empty method body or return placeholder, system will auto-call transform
    return {} as UserDto;
  }

  /**
   * Concrete implementation: preserve custom logic
   */
  toDtoWithValidation(entity: UserEntity): UserDto {
    if (!entity.fullName) {
      throw new Error('Username cannot be empty');
    }

    const dto = this.toDto(entity);
    dto.validated = true;
    return dto;
  }
}
```

## How It Works

### Proxy Auto-Implementation

The system uses `createMapperProxy` to create proxy objects:

```typescript
// Internal implementation principle (simplified)
export function createMapperProxy<T>(MapperClass: new () => T): T {
  const instance = new MapperClass();

  return new Proxy(instance, {
    get(target, propKey, receiver) {
      const original = Reflect.get(target, propKey, receiver);

      if (typeof original === 'function') {
        return function (...args: any[]) {
          // Check if it's an empty method body or abstract method
          if (isEmptyOrAbstractMethod(original, target, propKey)) {
            // Automatically execute transform
            return executeAutoTransform(target, String(propKey), args[0]);
          } else {
            // Preserve original method logic
            return original.apply(this, args);
          }
        };
      }

      return original;
    },
  });
}
```

## Mixed Mode Example

### Partial Auto, Partial Custom

```typescript
@Mapper()
export abstract class UserMapper {
  // Auto-implemented simple mapping
  @Mapping({ source: 'fullName', target: 'name' })
  @Mapping({ source: 'profile.bio', target: 'bio' })
  abstract toDto(entity: UserEntity): UserDto;

  // Custom implementation for complex mapping
  toDtoWithCalculations(entity: UserEntity): UserDto {
    const dto = this.toDto(entity); // Use auto-implemented method

    // Add calculated fields
    dto.age = this.calculateAge(entity.dateOfBirth);
    dto.membershipLevel = this.calculateMembershipLevel(entity);
    dto.permissions = this.getUserPermissions(entity.roles);

    return dto;
  }

  // Batch conversion
  toDtoList(entities: UserEntity[]): UserDto[] {
    return entities.map(entity => this.toDto(entity));
  }

  // Conversion with validation
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
    // Complex membership level calculation logic
    if (entity.totalSpent > 10000) return 'platinum';
    if (entity.totalSpent > 5000) return 'gold';
    if (entity.totalSpent > 1000) return 'silver';
    return 'bronze';
  }

  private getUserPermissions(roles: string[]): string[] {
    // Calculate permissions based on roles
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
      throw new Error('Username cannot be empty');
    }

    if (!entity.email || !this.isValidEmail(entity.email)) {
      throw new Error('Invalid email format');
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
```

## Type Safety

Abstract class support provides complete TypeScript type checking:

```typescript
@Mapper()
export abstract class TypeSafeMapper {
  // TypeScript checks parameter and return types
  abstract toDto(entity: UserEntity): UserDto;

  // Compile-time type checking
  processUser(entity: UserEntity): UserDto {
    const dto = this.toDto(entity); // dto type is UserDto

    // ✅ Correct: UserDto has name property
    console.log(dto.name);

    // ❌ Compile error: UserDto doesn't have fullName property
    // console.log(dto.fullName);

    return dto;
  }
}
```

## Testing Support

### Testing Abstract Mappers

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
    expect(dto.name).toBe('John Doe'); // fullName -> name mapping
    expect(dto.bio).toBe('Developer'); // profile.bio -> bio mapping
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

## Best Practices

1. **Clear method separation**: Separate auto-mapping and custom logic into different methods
2. **Type annotations**: Provide complete type annotations for abstract methods
3. **Documentation comments**: Add clear documentation for abstract methods
4. **Test coverage**: Test both auto-implementation and custom logic
5. **Performance considerations**: Avoid repeated calls to auto-mapping in custom methods

## Next Steps

- Learn how to handle [nested & circular dependencies](./circular-deps)
- Check [API documentation](../../api/nestjs-mapper) for complete interfaces
- Explore [core functionality](../core/getting-started) advanced usage
