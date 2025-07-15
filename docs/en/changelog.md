# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Complete documentation site built with VitePress
- Multi-language support (English and Chinese)
- Interactive examples and code snippets
- API reference documentation

### Improved
- Optimized documentation structure and navigation
- Added more usage examples
- Improved error handling documentation

## [0.1.0] - 2024-01-15

### Added

#### @ilhamtahir/ts-mapper (Core Package)
- ✨ `@Mapper()` decorator: Mark classes as mappers
- ✨ `@Mapping()` decorator: Define field mapping rules
- ✨ `transform()` function: Execute object mapping transformation
- ✨ `createMapperProxy()` function: Create proxy objects supporting abstract classes
- ✨ Automatic field mapping: Auto-assign when field names match
- ✨ Nested path support: Access nested properties using dot notation
- ✨ Type safety: Complete TypeScript type support
- ✨ Metadata storage: Manage mapping rules and Mapper registration

#### @ilhamtahir/nest-mapper (NestJS Integration Package)
- ✨ NestJS version of `@Mapper()` decorator: Automatically adds `@Injectable()` support
- ✨ `MapperModule`: Provides auto-registration and dependency injection configuration
- ✨ `MapperModule.forRoot()`: Globally register all Mappers
- ✨ `MapperModule.forFeature()`: Feature module-level Mapper registration
- ✨ Abstract class support: Support abstract method auto-implementation
- ✨ Empty method body support: Auto-detect and implement empty method bodies
- ✨ Dependency injection: Complete NestJS DI system integration
- ✨ Circular dependency handling: Support `forwardRef()` and lazy loading

#### Example Projects
- ✨ Complete NestJS example application
- ✨ User, order, product entity mapping examples
- ✨ Abstract class and mixed mode examples
- ✨ Circular dependency handling examples

### Features

#### Core Mapping Functionality
- **Automatic mapping**: Auto-map when field names match and types are compatible
- **Explicit mapping**: Define mapping rules through `@Mapping()` decorator
- **Nested mapping**: Support nested path access like `profile.bio`
- **Type safety**: Compile-time type checking and IntelliSense support
- **Batch conversion**: Support array and collection batch mapping

#### Advanced Features
- **Abstract class support**: Can define abstract Mapper classes
- **Auto-implementation**: Empty method bodies and abstract methods auto-call transform
- **Custom logic**: Preserve concrete method custom implementations
- **Proxy pattern**: Use Proxy for transparent method interception

#### NestJS Integration
- **Dependency injection**: Mappers can be injected into any NestJS component
- **Modular**: Support global and feature module-level registration
- **Scope support**: Support singleton, request, and transient scopes
- **Circular dependencies**: Elegantly handle circular dependencies between Mappers

### Development Tools

#### Build System
- TypeScript compilation configuration
- ESLint code linting
- Prettier code formatting
- Husky Git hooks
- Conventional Commits commit specification

#### Package Management
- pnpm workspace multi-package management
- Automated build and release process
- Version management and changelog generation

#### Examples and Documentation
- Complete usage examples
- API documentation and type definitions
- Best practices guide

### Technical Specifications

#### Compatibility
- Node.js >= 16.0.0
- TypeScript >= 5.0.0
- NestJS >= 10.0.0

#### Dependencies
- `reflect-metadata`: Metadata reflection support
- `@nestjs/common`: NestJS core functionality

#### Package Size
- `@ilhamtahir/ts-mapper`: ~15KB (gzipped)
- `@ilhamtahir/nest-mapper`: ~5KB (gzipped)

### Performance Features
- **Metadata caching**: Mapping rules cached on first use
- **Singleton pattern**: Mapper instances reused throughout application lifecycle
- **Lazy loading**: Support on-demand Mapper loading
- **Batch optimization**: Optimized performance for large data transformations

### Known Limitations
- Abstract methods cannot directly use decorators (TypeScript limitation)
- Requires enabling `experimentalDecorators` and `emitDecoratorMetadata`
- Circular references need special handling to avoid infinite recursion

## Roadmap

### v0.2.0 (Planned)
- [ ] Conditional mapping support
- [ ] Custom transformer registration
- [ ] Mapping configuration file support
- [ ] Performance monitoring and metrics
- [ ] More examples and templates

### v0.3.0 (Planned)
- [ ] Async mapping support
- [ ] Stream processing for large datasets
- [ ] Plugin system
- [ ] Visual mapping configuration tool

### v1.0.0 (Planned)
- [ ] Stable API
- [ ] Complete test coverage
- [ ] Production environment optimization
- [ ] Detailed performance benchmarks

## Contributors

Thanks to all developers who have contributed to this project:

- [IlhamTahir](https://github.com/ilhamtahir) - Project creator and main maintainer

## Support

If you encounter issues or have feature requests, please:

1. Check the [documentation](https://docs.ilham.dev/ts-mapper)
2. Search existing [Issues](https://github.com/ilhamtahir/nest-mapper/issues)
3. Create a new Issue or Discussion
4. Participate in community discussions

## License

This project is open source under the [MIT License](https://github.com/ilhamtahir/nest-mapper/blob/main/LICENSE).

---

**Note**: This changelog follows the [Keep a Changelog](https://keepachangelog.com/) format. Version numbers follow [Semantic Versioning](https://semver.org/) specification.
