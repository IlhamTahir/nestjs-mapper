# Custom Transformation Strategies

While ts-mapper provides powerful automatic mapping and decorator configuration features, sometimes you need to implement more complex transformation logic. This chapter introduces how to add custom logic to the mapping process.

## Basic Custom Logic

### Post-transform Processing

The simplest way is to add custom logic after the `transform()` call:

```typescript
@Mapper()
export class UserMapper {
  @Mapping({ source: 'fullName', target: 'name' })
  @Mapping({ source: 'profile.bio', target: 'bio' })
  toDto(entity: UserEntity): UserDto {
    // Execute basic mapping
    const dto = transform(this, 'toDto', entity, UserDto);

    // Add custom logic
    dto.displayName = `${entity.fullName} (${entity.id})`;
    dto.age = this.calculateAge(entity.dateOfBirth);
    dto.isActive = entity.status === 'active';

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

## Complex Data Transformation

### Array and Collection Processing

```typescript
interface UserEntity {
  id: number;
  name: string;
  tags: string[];
  roles: Role[];
  permissions: Map<string, boolean>;
}

interface UserDto {
  id: number;
  name: string;
  tagList: string;
  roleNames: string[];
  canEdit: boolean;
  canDelete: boolean;
}

@Mapper()
export class UserMapper {
  toDto(entity: UserEntity): UserDto {
    const dto = transform(this, 'toDto', entity, UserDto);

    // Array to string
    dto.tagList = entity.tags.join(', ');

    // Extract role names
    dto.roleNames = entity.roles.map(role => role.name);

    // Map to specific permissions
    dto.canEdit = entity.permissions.get('edit') || false;
    dto.canDelete = entity.permissions.get('delete') || false;

    return dto;
  }
}
```

## Data Validation and Cleaning

### Input Validation

```typescript
@Mapper()
export class UserMapper {
  toEntity(dto: UserDto): UserEntity {
    // Input validation
    if (!dto.name || dto.name.trim().length === 0) {
      throw new Error('Username cannot be empty');
    }

    if (!this.isValidEmail(dto.email)) {
      throw new Error('Invalid email format');
    }

    const entity = transform(this, 'toEntity', dto, UserEntity);

    // Data cleaning
    entity.name = dto.name.trim();
    entity.email = dto.email.toLowerCase();
    entity.createdAt = new Date();
    entity.updatedAt = new Date();

    return entity;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
```

## Best Practices

1. **Keep methods simple**: Break complex logic into private methods
2. **Error handling**: Always consider edge cases and error handling
3. **Type safety**: Make full use of TypeScript's type system
4. **Performance considerations**: Consider caching and optimization for large data transformations
5. **Test coverage**: Write unit tests for custom logic

## Next Steps

- Explore [NestJS integration](../nest/getting-started) dependency injection features
- Learn about [abstract class support](../nest/abstract-class) advanced usage
- Check [API documentation](../../api/ts-mapper) for complete interface definitions
