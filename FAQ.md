# Frequently Asked Questions (FAQ)

## 📦 Installation & Setup

### Q: What are the minimum requirements for using NestJS Mapper?

**A:** You need:

- Node.js >= 16.0.0
- TypeScript >= 4.7.0
- NestJS >= 10.0.0
- reflect-metadata >= 0.1.12

### Q: Do I need to install both packages?

**A:** It depends on your use case:

- **For NestJS projects**: Install both `@ilhamtahir/ts-mapper` and `@ilhamtahir/nest-mapper`
- **For standalone TypeScript projects**: Only `@ilhamtahir/ts-mapper` is needed

### Q: Can I use this library without NestJS?

**A:** Yes! The core package `@ilhamtahir/ts-mapper` works independently of NestJS. You can use it in any TypeScript project.

## 🛠️ Configuration

### Q: Why am I getting "experimentalDecorators" errors?

**A:** Make sure your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

### Q: How do I register mappers in my NestJS application?

**A:** Add `MapperModule.forRoot()` to your app module:

```typescript
@Module({
  imports: [MapperModule.forRoot()],
})
export class AppModule {}
```

### Q: Can I use custom module configuration?

**A:** Yes, you can pass options to `MapperModule.forRoot()`:

```typescript
MapperModule.forRoot({
  // Custom configuration options (if available)
});
```

## 🔄 Mapping

### Q: What's the difference between abstract classes and regular classes?

**A:**

- **Abstract classes**: Support empty method bodies that automatically call `transform()`
- **Regular classes**: Require explicit `transform()` calls in method bodies

### Q: How do I handle nested object mapping?

**A:** Use dot notation in the `@Mapping` decorator:

```typescript
@Mapping({ source: 'user.profile.firstName', target: 'userName' })
```

### Q: Can I map arrays and collections?

**A:** Yes, create helper methods in your mapper:

```typescript
@Mapper()
export class UserMapper {
  toDto(entity: UserEntity): UserDto {
    return transform(this, 'toDto', entity, UserDto);
  }

  toDtoList(entities: UserEntity[]): UserDto[] {
    return entities.map(entity => this.toDto(entity));
  }
}
```

### Q: How do I handle bidirectional mapping?

**A:** Create separate methods for each direction:

```typescript
@Mapper()
export class UserMapper {
  toDto(entity: UserEntity): UserDto {
    return transform(this, 'toDto', entity, UserDto);
  }

  toEntity(dto: UserDto): UserEntity {
    return transform(this, 'toEntity', dto, UserEntity);
  }
}
```

## 🐛 Troubleshooting

### Q: "Cannot resolve dependency" error in NestJS

**A:** This usually means:

1. You forgot to import `MapperModule.forRoot()` in your app module
2. The mapper class is not decorated with `@Mapper()`
3. There's a circular dependency issue

**Solution:**

```typescript
// Make sure your mapper is decorated
@Mapper()
export class UserMapper { ... }

// And imported in your module
@Module({
  imports: [MapperModule.forRoot()],
})
export class AppModule {}
```

### Q: Mapping is not working as expected

**A:** Check these common issues:

1. **Field names**: Ensure source and target field names are correct
2. **Type compatibility**: Verify that source and target types are compatible
3. **Nested paths**: Use correct dot notation for nested properties
4. **Method body**: For abstract classes, ensure method bodies are empty or contain only `return {} as Type;`

### Q: Performance issues with large datasets

**A:** Consider these optimizations:

1. Use abstract classes with empty method bodies for better performance
2. Implement batch processing for large arrays
3. Cache frequently used mappers
4. Avoid complex transformations in mapping methods

## 🔧 Advanced Usage

### Q: Can I add custom transformation logic?

**A:** Yes, you can mix automatic mapping with custom logic:

```typescript
@Mapper()
export class UserMapper {
  @Mapping({ source: 'fullName', target: 'name' })
  toDto(entity: UserEntity): UserDto {
    const dto = transform(this, 'toDto', entity, UserDto);

    // Custom post-processing
    dto.name = dto.name?.toUpperCase();
    dto.createdAt = new Date().toISOString();

    return dto;
  }
}
```

### Q: How do I handle conditional mapping?

**A:** Use custom logic in your mapper methods:

```typescript
@Mapper()
export class UserMapper {
  toDto(entity: UserEntity): UserDto {
    const dto = transform(this, 'toDto', entity, UserDto);

    // Conditional logic
    if (entity.isVip) {
      dto.displayName = `[VIP] ${dto.displayName}`;
    }

    return dto;
  }
}
```

### Q: Can I use dependency injection in mappers?

**A:** Yes, mappers are regular NestJS providers:

```typescript
@Mapper()
export class UserMapper {
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: Logger
  ) {}

  toDto(entity: UserEntity): UserDto {
    // Use injected dependencies
    const config = this.configService.get('mapping');
    this.logger.log('Mapping user entity');

    return transform(this, 'toDto', entity, UserDto);
  }
}
```

## 🚀 Best Practices

### Q: What are the recommended patterns?

**A:** Follow these best practices:

1. **Use abstract classes** for simple mappings
2. **Group related mappings** in the same mapper class
3. **Keep mapping logic simple** - avoid complex transformations
4. **Use descriptive method names** like `toDto`, `toEntity`, `toViewModel`
5. **Handle null/undefined values** appropriately
6. **Write tests** for your mappers

### Q: How should I organize my mappers?

**A:** Recommended structure:

```
src/
├── mappers/
│   ├── user.mapper.ts
│   ├── product.mapper.ts
│   └── order.mapper.ts
├── dto/
├── entities/
└── ...
```

### Q: Should I create one mapper per entity?

**A:** Generally yes, but you can also:

- Create specialized mappers for different contexts
- Group related entities in one mapper
- Create base mappers for common functionality

## 📚 Resources

### Q: Where can I find more examples?

**A:** Check out:

- [Examples directory](./examples/) in this repository
- [Documentation site](https://ilhamtahir.github.io/nest-mapper/) (coming soon)
- [GitHub Wiki](https://github.com/ilhamtahir/nest-mapper/wiki)

### Q: How do I report bugs or request features?

**A:**

- **Bugs**: [Create an issue](https://github.com/ilhamtahir/nest-mapper/issues/new?template=bug_report.md)
- **Features**: [Create a feature request](https://github.com/ilhamtahir/nest-mapper/issues/new?template=feature_request.md)
- **Questions**: [Start a discussion](https://github.com/ilhamtahir/nest-mapper/discussions)

### Q: Can I contribute to the project?

**A:** Absolutely! See our [Contributing Guide](./CONTRIBUTING.md) for details on how to get started.

---

**Still have questions?** Feel free to [open a discussion](https://github.com/ilhamtahir/nest-mapper/discussions) or [create an issue](https://github.com/ilhamtahir/nest-mapper/issues/new/choose)!
