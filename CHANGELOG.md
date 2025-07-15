# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
- `@ilhamtahir/nest-mapper`: NestJS integration package

### 🔧 Development Tools

- **ESLint + Prettier**: Code quality and formatting
- **Husky + lint-staged**: Git hooks automation
- **Conventional Commits**: Standardized commit messages
- **Standard Version**: Automatic versioning and changelog generation
- **GitHub Actions**: CI/CD automation
