# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### 1.0.1 (2025-07-15)


### ✨ Features

* **core:** implement ts-mapper and nestjs-mapper with abstract class + proxy support ([cef69dc](https://github.com/ilhamtahir/nestjs-mapper/commit/cef69dc95e16b5a1513529dc3d847afff4764276))
* **doc:** add docs project ([1c2d1f6](https://github.com/ilhamtahir/nestjs-mapper/commit/1c2d1f61b5b3131115595f5b36eadd77905d310c))
* **doc:** add docs project ([f8484b6](https://github.com/ilhamtahir/nestjs-mapper/commit/f8484b6b34a78a8a03fd2d95173a781ed7f10aed))
* finish nestjs-mapper ([df7ad01](https://github.com/ilhamtahir/nestjs-mapper/commit/df7ad014e05d74037805ab34649df3db50a5c275))
* finish nestjs-mapper ([9a1b0be](https://github.com/ilhamtahir/nestjs-mapper/commit/9a1b0bef048df12e3ce7a6a6fe21b8b131ec7266))
* init project ([a30cbb7](https://github.com/ilhamtahir/nestjs-mapper/commit/a30cbb7f2556efb143a02d39bd08192aa73c457c))

## [1.0.0] - 2025-07-15

### ✨ Features

- **Abstract Class Support**: Allows declaring Mapper with abstract class
- **Proxy Auto Implementation**: Automatically invokes `transform()` for empty method bodies
- **Custom Method Preservation**: Keeps original logic for non-empty methods
- **Enhanced NestJS Integration**: Improved NestJS dependency injection support
- **Automatic Field Mapping**: Automatically maps fields with matching names
- **Nested Path Support**: Supports mapping for nested fields like `profile.bio`
- **TypeScript Safety**: Fully built with TypeScript for strong type safety

### 🛠 Technical Improvements

- **createMapperProxy()**: Added proxy utility function
- **Smart Method Detection**: Auto-detects empty vs custom methods
- **Decorator-Driven**: `@Mapper()` and `@Mapping()` decorators
- **Metadata Storage**: Optimized metadata storage system

### 📦 Packages

- `@ilhamtahir/ts-mapper`: Core mapping library
- `@ilhamtahir/nestjs-mapper`: NestJS integration package

### 🔧 Development Tools

- **ESLint + Prettier**: Code quality and formatting
- **Husky + lint-staged**: Git hooks automation
- **Conventional Commits**: Standardized commit messages
- **Standard Version**: Automatic versioning and changelog generation
- **GitHub Actions**: CI/CD automation
