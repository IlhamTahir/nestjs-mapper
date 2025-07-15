# Contributing Guide

Thank you for your interest in the ts-mapper project! We welcome all forms of contributions, including but not limited to code, documentation, issue reports, and feature suggestions.

## Development Environment Setup

### Prerequisites

- Node.js >= 16.0.0
- pnpm >= 8.0.0
- TypeScript >= 5.0.0

### Clone the Project

```bash
git clone https://github.com/ilhamtahir/nestjs-mapper.git
cd nestjs-mapper
```

### Install Dependencies

```bash
pnpm install
```

### Project Structure

```
nestjs-mapper/
├── packages/
│   ├── core/                 # @ilhamtahir/ts-mapper core package
│   │   ├── src/
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── nestjs/               # @ilhamtahir/nestjs-mapper NestJS integration package
│       ├── src/
│       ├── package.json
│       └── tsconfig.json
├── examples/
│   └── nest-app/             # Example application
├── docs/                     # Documentation source code
│   ├── .vitepress/
│   ├── en/                   # English documentation
│   ├── zh/                   # Chinese documentation
│   └── index.md
├── scripts/                  # Build and release scripts
└── package.json              # Root package.json
```

## Development Workflow

### Build the Project

```bash
# Build all packages
pnpm build

# Build specific packages
pnpm build:core
pnpm build:nestjs
```

### Run Examples

```bash
# Start example application
pnpm dev:example

# Build example application
pnpm build:example
```

### Code Quality Checks

```bash
# Code linting
pnpm lint

# Code formatting
pnpm format

# Type checking
pnpm type-check

# Run all checks
pnpm pre-release
```

### Documentation Development

```bash
# Start documentation development server
pnpm docs:dev

# Build documentation
pnpm docs:build

# Preview built documentation
pnpm docs:preview
```

## Contribution Types

### 🐛 Bug Reports

Found a bug? Please report it through [GitHub Issues](https://github.com/ilhamtahir/nest-mapper/issues):

1. Use a clear title to describe the issue
2. Provide detailed reproduction steps
3. Include expected behavior and actual behavior
4. Provide environment information (Node.js version, TypeScript version, etc.)
5. If possible, provide a minimal reproduction example

**Bug Report Template:**

```markdown
## Bug Description

A clear and concise description of the bug.

## Reproduction Steps

1. Do '...'
2. Click on '....'
3. Scroll to '....'
4. See error

## Expected Behavior

A clear and concise description of what you expected to happen.

## Actual Behavior

A clear and concise description of what actually happened.

## Environment Information

- OS: [e.g., macOS 12.0]
- Node.js: [e.g., 18.0.0]
- TypeScript: [e.g., 5.0.0]
- Package Version: [e.g., @ilhamtahir/ts-mapper@0.1.0]

## Additional Information

Add any other relevant information or screenshots.
```

### ✨ Feature Requests

Have an idea for a new feature? We'd love to hear it:

1. Check if a similar feature request already exists
2. Clearly describe the feature's purpose and value
3. Provide use cases and examples
4. Consider backward compatibility

### 📝 Documentation Improvements

Documentation improvements include:

- Fixing typos and grammar errors
- Improving clarity of existing documentation
- Adding missing documentation
- Updating outdated information
- Adding more examples

### 💻 Code Contributions

#### Development Process

1. **Fork the Project**

   ```bash
   # Fork the project on GitHub
   git clone https://github.com/YOUR_USERNAME/nest-mapper.git
   cd nest-mapper
   ```

2. **Create Feature Branch**

   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

3. **Develop and Test**

   ```bash
   # Install dependencies
   pnpm install

   # Develop your feature
   # ...

   # Run tests
   pnpm test

   # Code quality checks
   pnpm lint
   pnpm format
   pnpm type-check
   ```

4. **Commit Changes**

   ```bash
   git add .
   git commit -m "feat: add new mapping feature"
   ```

5. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   # Create Pull Request on GitHub
   ```

#### Code Standards

- Write all code in TypeScript
- Follow existing code style (ESLint + Prettier)
- Add type definitions for new features
- Write clear comments and documentation strings
- Maintain backward compatibility

#### Commit Message Convention

We use [Conventional Commits](https://conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (not affecting functionality)
- `refactor`: Code refactoring
- `test`: Adding or modifying tests
- `chore`: Build process or auxiliary tool changes

**Examples:**

```
feat(core): add support for custom transformation strategies

fix(nestjs): resolve circular dependency issue in mapper injection

docs: update getting started guide with new examples

test(core): add unit tests for nested path mapping
```

## Testing

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests for specific package
pnpm --filter @ilhamtahir/ts-mapper test
pnpm --filter @ilhamtahir/nest-mapper test

# Run tests and generate coverage report
pnpm test:coverage
```

### Writing Tests

- Write unit tests for new features
- Ensure test coverage doesn't decrease
- Use descriptive test names
- Test edge cases and error handling

**Test Example:**

```typescript
describe('UserMapper', () => {
  let mapper: UserMapper;

  beforeEach(() => {
    mapper = new UserMapper();
  });

  describe('toDto', () => {
    it('should map basic fields correctly', () => {
      const entity: UserEntity = {
        id: 1,
        fullName: 'John Doe',
        email: 'john@example.com',
      };

      const dto = mapper.toDto(entity);

      expect(dto.id).toBe(1);
      expect(dto.name).toBe('John Doe');
      expect(dto.email).toBe('john@example.com');
    });

    it('should handle nested path mapping', () => {
      const entity: UserEntity = {
        id: 1,
        fullName: 'John Doe',
        profile: {
          bio: 'Developer',
          avatar: 'avatar.jpg',
        },
      };

      const dto = mapper.toDto(entity);

      expect(dto.bio).toBe('Developer');
      expect(dto.avatar).toBe('avatar.jpg');
    });

    it('should handle null values gracefully', () => {
      const entity: UserEntity = {
        id: 1,
        fullName: 'John Doe',
        profile: null,
      };

      const dto = mapper.toDto(entity);

      expect(dto.bio).toBeUndefined();
      expect(dto.avatar).toBeUndefined();
    });
  });
});
```

## Release Process

### Version Management

We use [Semantic Versioning](https://semver.org/):

- `MAJOR`: Incompatible API changes
- `MINOR`: Backward-compatible feature additions
- `PATCH`: Backward-compatible bug fixes

### Release Steps

```bash
# 1. Ensure all checks pass
pnpm pre-release

# 2. Update version number
pnpm version:patch  # or version:minor, version:major

# 3. Publish to npm
pnpm release

# 4. Push to GitHub
git push origin main --tags
```

## Community Guidelines

### Code of Conduct

- Be friendly and respectful
- Welcome new contributors
- Provide constructive feedback
- Focus on what's best for the project

### Communication Channels

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General discussions and questions
- **Pull Requests**: Code review and discussion

## Getting Help

If you encounter issues during the contribution process:

1. Check existing [Issues](https://github.com/ilhamtahir/nest-mapper/issues)
2. Search [Discussions](https://github.com/ilhamtahir/nest-mapper/discussions)
3. Create a new Issue or Discussion
4. @mention maintainers in PRs

## Acknowledgements

Thank you to all developers who have contributed to the ts-mapper project! Your contributions make this project better.

### Contributors

- [IlhamTahir](https://github.com/ilhamtahir) - Project creator and maintainer

---

Thank you again for your contribution! 🎉
