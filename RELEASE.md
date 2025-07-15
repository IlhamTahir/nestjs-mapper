# Release Guide

This document describes how to release `@ilhamtahir/ts-mapper` and `@ilhamtahir/nest-mapper` packages.

## 🚀 Quick Release

### Automated Release (Recommended)

```bash
# Patch version (0.1.0 -> 0.1.1)
./scripts/release.sh patch

# Minor version (0.1.0 -> 0.2.0)
./scripts/release.sh minor

# Major version (0.1.0 -> 1.0.0)
./scripts/release.sh major
```

### Manual Release

```bash
# 1. Run pre-release checks
pnpm run pre-release

# 2. Generate version and changelog
pnpm run version:patch  # or version:minor, version:major

# 3. Push to remote repository
git push --follow-tags origin main

# 4. Publish to npm
pnpm run release:core
pnpm run release:nestjs
```

## 📋 Pre-release Checklist

- [ ] All tests pass
- [ ] Code has been linted
- [ ] Code has been formatted
- [ ] TypeScript type checking passes
- [ ] Build succeeds
- [ ] Working directory is clean (no uncommitted changes)
- [ ] On main branch (main or master)
- [ ] Latest code has been pulled

## 🔧 Release Scripts Description

### Available Scripts

| Script                    | Description                  |
| ------------------------- | ---------------------------- |
| `pnpm run lint`           | Run ESLint and auto-fix      |
| `pnpm run lint:check`     | Check code style (no fixes)  |
| `pnpm run format`         | Format code                  |
| `pnpm run format:check`   | Check code formatting        |
| `pnpm run type-check`     | TypeScript type checking     |
| `pnpm run pre-release`    | Run all pre-release checks   |
| `pnpm run changelog`      | Generate changelog           |
| `pnpm run version`        | Automatic version management |
| `pnpm run version:patch`  | Patch version release        |
| `pnpm run version:minor`  | Minor version release        |
| `pnpm run version:major`  | Major version release        |
| `pnpm run release:core`   | Publish core package         |
| `pnpm run release:nestjs` | Publish NestJS package       |
| `pnpm run release`        | Complete release process     |

### Git Hooks

The project is configured with the following Git hooks:

- **pre-commit**: Run lint-staged, auto-format and check code
- **commit-msg**: Check commit message format (follows conventional commits)

## 📝 Commit Message Convention

The project uses [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Type Descriptions

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation update
- `style`: Code formatting (no functional changes)
- `refactor`: Refactoring
- `perf`: Performance optimization
- `test`: Test-related
- `chore`: Build process or auxiliary tool changes
- `ci`: CI configuration files and script changes
- `build`: Build system or external dependency changes
- `revert`: Revert commit

### Examples

```bash
feat: add abstract class support
fix: fix empty method body detection logic
docs: update README documentation
chore: add release scripts
```

## 🔄 Version Management

The project uses [standard-version](https://github.com/conventional-changelog/standard-version) for version management:

- Automatically generate version numbers
- Automatically generate CHANGELOG.md
- Automatically create git tags
- Support pre-release versions

## 📦 Package Publishing

### Publishing to npm

Make sure you are logged in to npm:

```bash
npm login
```

Packages will be published to:

- `@ilhamtahir/ts-mapper` - Core mapping library
- `@ilhamtahir/nest-mapper` - NestJS integration

### Publishing Permissions

Only project maintainers can publish packages. If you need publishing permissions, please contact the project owner.

## 🚨 Troubleshooting

### Common Issues

1. **Publishing failed: Insufficient permissions**

   ```bash
   npm login
   # Make sure you have publishing permissions
   ```

2. **Version conflict**

   ```bash
   # Check if there are new commits on remote
   git pull origin main
   ```

3. **Build failure**

   ```bash
   # Clean and reinstall dependencies
   pnpm clean
   pnpm install
   pnpm build
   ```

4. **Git hooks failure**
   ```bash
   # Fix code style issues
   pnpm run lint
   pnpm run format
   ```

### Rolling Back Release

If you need to roll back a release:

```bash
# Unpublish from npm (within 24 hours)
npm unpublish @ilhamtahir/ts-mapper@<version>
npm unpublish @ilhamtahir/nest-mapper@<version>

# Delete git tag
git tag -d v<version>
git push origin :refs/tags/v<version>

# Revert commit
git revert <commit-hash>
```

## 📞 Support

If you encounter issues during the release process:

1. Check the troubleshooting section in this document
2. Review GitHub Actions build logs
3. Create an issue on GitHub
4. Contact project maintainers
