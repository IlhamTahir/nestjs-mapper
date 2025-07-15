# @Mapping Decorator

The `@Mapping` decorator is used to define explicit field mapping rules, supporting field renaming, nested path access, and other advanced features.

## Basic Syntax

```typescript
@Mapping({ source: 'sourceField', target: 'targetField' })
```

### Parameters

```typescript
interface MappingOptions {
  source: string; // Source field path
  target: string; // Target field path
}
```

## Basic Usage

### Field Renaming

The most common usage is mapping fields with different names:

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

### Multiple Mapping Rules

A method can have multiple `@Mapping` decorators:

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

## Nested Path Mapping

### Extracting Fields from Nested Objects

Use dot notation syntax to access nested properties:

```typescript
// Source data structure
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

// Target data structure
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

### Mapping to Nested Objects

You can also map flat fields to nested structures:

```typescript
// Source data structure
interface UserDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

// Target data structure
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

## Real-world Examples

### User Information Mapping

```typescript
// Entity class
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

// DTO class
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

    // Custom logic: calculate age
    if (entity.dateOfBirth) {
      const today = new Date();
      const birthDate = new Date(entity.dateOfBirth);
      dto.age = today.getFullYear() - birthDate.getFullYear();
    }

    return dto;
  }
}
```

### Bidirectional Mapping

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

  // DTO -> Entity (reverse mapping)
  @Mapping({ source: 'name', target: 'fullName' })
  @Mapping({ source: 'bio', target: 'profile.bio' })
  @Mapping({ source: 'avatar', target: 'profile.avatar' })
  toEntity(dto: UserDto): UserEntity {
    const entity = transform(this, 'toEntity', dto, UserEntity);

    // Set default values
    entity.createdAt = new Date();
    entity.updatedAt = new Date();

    return entity;
  }
}
```

## Error Handling

### Non-existent Paths

When source path doesn't exist, target field is set to `undefined`:

```typescript
const entity = {
  id: 1,
  profile: null, // profile is null
};

@Mapper()
export class UserMapper {
  @Mapping({ source: 'profile.bio', target: 'bio' })
  toDto(entity: any): any {
    return transform(this, 'toDto', entity, Object);
  }
}

const result = mapper.toDto(entity);
// result.bio is undefined
```

### Type Safety Checking

TypeScript checks path validity at compile time:

```typescript
@Mapper()
export class UserMapper {
  // ✅ Correct: path exists
  @Mapping({ source: 'profile.bio', target: 'bio' })
  toDto(entity: UserEntity): UserDto {
    return transform(this, 'toDto', entity, UserDto);
  }

  // ❌ Compile warning: path might not exist
  @Mapping({ source: 'profile.nonExistentField', target: 'bio' })
  wrongMapping(entity: UserEntity): UserDto {
    return transform(this, 'wrongMapping', entity, UserDto);
  }
}
```

## Best Practices

### 1. Clear Mapping Rules

```typescript
// ✅ Recommended: clear field mapping
@Mapping({ source: 'user.personalInfo.fullName', target: 'displayName' })
@Mapping({ source: 'user.contactInfo.primaryEmail', target: 'email' })

// ❌ Not recommended: unclear mapping
@Mapping({ source: 'u.p.n', target: 'n' })
```

### 2. Group Related Mappings

```typescript
@Mapper()
export class UserMapper {
  // Basic information mapping
  @Mapping({ source: 'fullName', target: 'name' })
  @Mapping({ source: 'dateOfBirth', target: 'birthDate' })

  // Contact information mapping
  @Mapping({ source: 'contact.email', target: 'email' })
  @Mapping({ source: 'contact.phone', target: 'phone' })

  // Profile mapping
  @Mapping({ source: 'profile.bio', target: 'bio' })
  @Mapping({ source: 'profile.avatar', target: 'avatar' })
  toDto(entity: UserEntity): UserDto {
    return transform(this, 'toDto', entity, UserDto);
  }
}
```

### 3. Documentation Comments

```typescript
@Mapper()
export class UserMapper {
  /**
   * Convert user entity to DTO
   * - fullName -> name: User display name
   * - profile.bio -> bio: Personal bio
   * - profile.avatar -> avatar: Avatar URL
   */
  @Mapping({ source: 'fullName', target: 'name' })
  @Mapping({ source: 'profile.bio', target: 'bio' })
  @Mapping({ source: 'profile.avatar', target: 'avatar' })
  toDto(entity: UserEntity): UserDto {
    return transform(this, 'toDto', entity, UserDto);
  }
}
```

## Next Steps

- Learn about [custom transformation strategies](./custom-strategy) for complex mapping logic
- Explore [NestJS integration](../nest/getting-started) dependency injection features
- Check [API documentation](../../api/ts-mapper) for complete interface definitions
