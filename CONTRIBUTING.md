# Contributing to NestJS Mapper

Thank you for your interest in contributing to NestJS Mapper! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

- Node.js >= 16.0.0
- pnpm (recommended) or npm/yarn
- Git

### Development Setup

1. **Fork and Clone**

   ```bash
   git clone https://github.com/YOUR_USERNAME/nest-mapper.git
   cd nest-mapper
   ```

2. **Install Dependencies**

   ```bash
   pnpm install
   ```

3. **Build Packages**

   ```bash
   pnpm build
   ```

4. **Run Tests**

   ```bash
   pnpm test
   ```

5. **Run Example**
   ```bash
   pnpm dev:example
   ```

## 📁 Project Structure

```
nestjs-mapper/
├── packages/
│   ├── core/                 # @ilhamtahir/ts-mapper
│   └── nestjs/              # @ilhamtahir/nestjs-mapper
├── examples/
│   └── nestjs-app/          # Example application
├── docs/                    # Documentation
├── scripts/                 # Build and release scripts
└── tests/                   # Integration tests
```

## 🛠️ Development Workflow

### Code Quality

We maintain high code quality standards:

```bash
# Linting
pnpm lint          # Check for issues
pnpm lint --fix    # Auto-fix issues

# Formatting
pnpm format        # Format code with Prettier

# Type Checking
pnpm type-check    # TypeScript type checking

# Pre-release Check
pnpm pre-release   # Run all checks + build + test
```

### Testing

```bash
# Unit Tests
pnpm test

# Watch Mode
pnpm test:watch

# Coverage Report
pnpm test:cov
```

### Building

```bash
# Build all packages
pnpm build

# Build specific package
pnpm build:core
pnpm build:nestjs
```

## 📝 Commit Guidelines

We use [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Commit Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Build process or auxiliary tool changes

### Examples

```bash
feat: add support for custom transformation functions
fix: resolve circular dependency in mapper registration
docs: update installation guide with troubleshooting
test: add unit tests for nested mapping scenarios
```

### Commit Message Format

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

## 🔄 Pull Request Process

1. **Create Feature Branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Write code following our style guidelines
   - Add tests for new functionality
   - Update documentation if needed

3. **Test Your Changes**

   ```bash
   pnpm pre-release
   ```

4. **Commit Changes**

   ```bash
   git add .
   git commit -m "feat: your feature description"
   ```

5. **Push and Create PR**

   ```bash
   git push origin feature/your-feature-name
   ```

6. **PR Requirements**
   - Clear description of changes
   - Link to related issues
   - All tests passing
   - Code review approval

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Environment Information**
   - Node.js version
   - TypeScript version
   - NestJS version
   - Package versions

2. **Reproduction Steps**
   - Minimal code example
   - Expected behavior
   - Actual behavior

3. **Additional Context**
   - Error messages
   - Stack traces
   - Screenshots (if applicable)

## 💡 Feature Requests

For feature requests:

1. **Check Existing Issues** - Avoid duplicates
2. **Provide Context** - Explain the use case
3. **Suggest Implementation** - If you have ideas
4. **Consider Scope** - Keep it focused

## 📚 Documentation

Help improve our documentation:

- Fix typos and grammar
- Add examples and use cases
- Improve API documentation
- Translate to other languages

## 🏷️ Release Process

Releases are handled by maintainers:

1. **Version Bumping**

   ```bash
   pnpm version:patch  # Bug fixes
   pnpm version:minor  # New features
   pnpm version:major  # Breaking changes
   ```

2. **Publishing**
   ```bash
   ./scripts/release.sh patch
   ```

## 🤝 Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Follow our community guidelines

## 📞 Getting Help

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: Questions and community support
- **Wiki**: Additional guides and tutorials

## 🙏 Recognition

Contributors will be recognized in:

- README.md contributors section
- Release notes
- GitHub contributors page

Thank you for contributing to NestJS Mapper! 🎉
