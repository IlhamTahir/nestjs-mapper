# transform() Function

The `transform()` function is the core of ts-mapper, responsible for executing actual object mapping transformations.

## Function Signature

```typescript
function transform<TInput, TOutput>(
  mapper: any,
  method: string,
  input: TInput,
  outputType: new () => TOutput
): TOutput;
```

### Parameters

- `mapper`: Mapper instance (usually `this`)
- `method`: Method name (used to retrieve mapping metadata)
- `input`: Input object
- `outputType`: Output type constructor function

## How It Works

The transform function executes mapping in the following order:

### 1. Explicit Field Mapping

First processes explicit mappings defined through `@Mapping()` decorators:

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

### 2. Automatic Field Matching

Then processes automatic mapping for fields with same names and compatible types:

```typescript
// These fields are automatically mapped: id, age, email
const entity = { id: 1, fullName: 'John', age: 30, email: 'john@example.com' };
const dto = transform(mapper, 'toDto', entity, UserDto);
// Result: { id: 1, name: 'John', age: 30, email: 'john@example.com' }
```

## Nested Path Support

transform supports dot notation syntax to access nested properties:

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

## Type Safety

The transform function provides complete TypeScript type inference:

```typescript
@Mapper()
export class UserMapper {
  toDto(entity: UserEntity): UserDto {
    // Return type automatically inferred as UserDto
    return transform(this, 'toDto', entity, UserDto);
  }
}

const mapper = new UserMapper();
const entity: UserEntity = {
  /* ... */
};
const dto = mapper.toDto(entity); // dto type is UserDto
```

## Error Handling

### Non-existent Nested Paths

When accessing non-existent nested paths, transform safely returns `undefined`:

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
// result.bio is undefined, no error thrown
```

### Type Mismatches

TypeScript checks type compatibility at compile time:

```typescript
@Mapper()
export class UserMapper {
  toDto(entity: UserEntity): UserDto {
    // ✅ Correct: types match
    return transform(this, 'toDto', entity, UserDto);
  }

  wrongUsage(entity: UserEntity): UserDto {
    // ❌ Compile error: type mismatch
    return transform(this, 'toDto', entity, string);
  }
}
```

## Performance Optimization

### Metadata Caching

Mapping metadata is cached on first use, subsequent calls use cached data:

```typescript
const mapper = new UserMapper();

// First call: parse and cache metadata
const dto1 = mapper.toDto(entity1);

// Subsequent calls: use cached metadata
const dto2 = mapper.toDto(entity2);
const dto3 = mapper.toDto(entity3);
```

### Batch Conversion Optimization

For batch conversions, use array methods instead of manual loops:

```typescript
@Mapper()
export class UserMapper {
  // ✅ Recommended: use map
  toDtoList(entities: UserEntity[]): UserDto[] {
    return entities.map(entity => this.toDto(entity));
  }

  // ❌ Not recommended: manual loop
  toDtoListSlow(entities: UserEntity[]): UserDto[] {
    const results: UserDto[] = [];
    for (const entity of entities) {
      results.push(this.toDto(entity));
    }
    return results;
  }
}
```

## Debugging Tips

### View Mapping Metadata

You can inspect registered mapping information through metadataStorage:

```typescript
import { metadataStorage } from '@ilhamtahir/ts-mapper';

// Get mapping configuration for specific method
const mappings = metadataStorage.getMappings(UserMapper, 'toDto');
console.log('Mapping config:', mappings);

// Get all registered Mappers
const allMappers = metadataStorage.getAllMappers();
console.log('All Mappers:', allMappers);
```

### Runtime Inspection

In development environment, you can add logging to track mapping process:

```typescript
@Mapper()
export class UserMapper {
  toDto(entity: UserEntity): UserDto {
    console.log('Input:', entity);
    const result = transform(this, 'toDto', entity, UserDto);
    console.log('Output:', result);
    return result;
  }
}
```

## Best Practices

1. **Clear method naming**: Use clear method names like `toDto`, `toEntity`
2. **Type annotations**: Always add type annotations for method parameters and return values
3. **Error handling**: Check for potentially null nested properties
4. **Performance considerations**: Consider using batch methods for large data transformations

## Next Steps

- Learn advanced usage of [@Mapping decorator](./mapping)
- Understand how to implement [custom transformation strategies](./custom-strategy)
- Explore [NestJS integration](../nestjs/getting-started) auto-mapping features
