# ts-mapper API Documentation

The `@ilhamtahir/ts-mapper` core package provides basic object mapping functionality.

## Decorators

### @Mapper()

Marks a class as a mapper and registers it in the metadata storage.

```typescript
function Mapper(): ClassDecorator;
```

**Example:**

```typescript
@Mapper()
export class UserMapper {
  // mapping methods
}
```

### @Mapping(options)

Defines field mapping rules.

```typescript
function Mapping(options: MappingOptions): MethodDecorator;

interface MappingOptions {
  source: string; // Source field path
  target: string; // Target field path
}
```

**Parameters:**

- `source`: Field path in source object, supports dot notation for nested properties
- `target`: Field path in target object, supports dot notation for nested properties

**Example:**

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

## Core Functions

### transform()

The core function that executes object mapping transformation.

```typescript
function transform<TInput, TOutput>(
  mapper: any,
  method: string,
  input: TInput,
  outputType: new () => TOutput
): TOutput;
```

**Parameters:**

- `mapper`: Mapper instance (usually `this`)
- `method`: Method name for retrieving mapping metadata
- `input`: Input object
- `outputType`: Output type constructor function

**Returns:**

- Transformed target object

**Example:**

```typescript
@Mapper()
export class UserMapper {
  @Mapping({ source: 'fullName', target: 'name' })
  toDto(entity: UserEntity): UserDto {
    return transform(this, 'toDto', entity, UserDto);
  }
}
```

### createMapperProxy()

Creates a Mapper proxy object that supports abstract classes and empty method body auto-implementation.

```typescript
function createMapperProxy<T extends object>(MapperClass: new (...args: any[]) => T): T;
```

**Parameters:**

- `MapperClass`: Mapper class constructor (supports abstract classes)

**Returns:**

- Proxied Mapper instance

**Example:**

```typescript
// Abstract Mapper class
@Mapper()
export abstract class UserMapper {
  @Mapping({ source: 'fullName', target: 'name' })
  abstract toDto(entity: UserEntity): UserDto;
}

// Create proxy instance
const mapper = createMapperProxy(UserMapper);
const dto = mapper.toDto(entity); // Auto-implemented
```

## Metadata Management

### metadataStorage

Global metadata storage instance that manages Mapper and mapping rule registration information.

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

**Methods:**

#### registerMapper(mapper)

Registers a Mapper class to metadata storage.

#### registerMapping(mapper, method, option)

Registers field mapping rules.

#### getMappings(mapper, method)

Gets mapping rules for a specific method.

#### getAllMappers()

Gets all registered Mapper classes.

## Type Definitions

### MappingOptions

Mapping options interface.

```typescript
interface MappingOptions {
  source: string; // Source field path
  target: string; // Target field path
}
```

## Usage Examples

### Basic Mapping

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

### Abstract Class Mapping

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

## Best Practices

1. Always add `@Mapper()` decorator to Mapper classes
2. Use TypeScript type annotations to ensure type safety
3. Check for potentially null nested properties
4. Add appropriate error handling in custom logic
5. Use `createMapperProxy` for abstract classes and empty method bodies
