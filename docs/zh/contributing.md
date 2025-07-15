# 贡献指南

感谢您对 ts-mapper 项目的关注！我们欢迎各种形式的贡献，包括但不限于代码、文档、问题报告和功能建议。

## 开发环境设置

### 前置要求

- Node.js >= 16.0.0
- pnpm >= 8.0.0
- TypeScript >= 5.0.0

### 克隆项目

```bash
git clone https://github.com/ilhamtahir/nestjs-mapper.git
cd nestjs-mapper
```

### 安装依赖

```bash
pnpm install
```

### 项目结构

```
nestjs-mapper/
├── packages/
│   ├── core/                 # @ilhamtahir/ts-mapper 核心包
│   │   ├── src/
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── nestjs/               # @ilhamtahir/nestjs-mapper NestJS 集成包
│       ├── src/
│       ├── package.json
│       └── tsconfig.json
├── examples/
│   └── nestjs-app/             # 示例应用
├── docs/                     # 文档源码
│   ├── .vitepress/
│   ├── guide/
│   ├── api/
│   └── index.md
├── scripts/                  # 构建和发布脚本
└── package.json              # 根 package.json
```

## 开发工作流

### 构建项目

```bash
# 构建所有包
pnpm build

# 构建特定包
pnpm build:core
pnpm build:nestjs
```

### 运行示例

```bash
# 启动示例应用
pnpm dev:example

# 构建示例应用
pnpm build:example
```

### 代码质量检查

```bash
# 代码检查
pnpm lint

# 代码格式化
pnpm format

# 类型检查
pnpm type-check

# 运行所有检查
pnpm pre-release
```

### 文档开发

```bash
# 启动文档开发服务器
pnpm docs:dev

# 构建文档
pnpm docs:build

# 预览构建的文档
pnpm docs:preview
```

## 贡献类型

### 🐛 Bug 报告

发现 bug？请通过 [GitHub Issues](https://github.com/ilhamtahir/nestjs-mapper/issues) 报告：

1. 使用清晰的标题描述问题
2. 提供详细的重现步骤
3. 包含预期行为和实际行为
4. 提供环境信息（Node.js 版本、TypeScript 版本等）
5. 如果可能，提供最小重现示例

**Bug 报告模板：**

```markdown
## Bug 描述

简洁清晰地描述 bug。

## 重现步骤

1. 执行 '...'
2. 点击 '....'
3. 滚动到 '....'
4. 看到错误

## 预期行为

清晰简洁地描述您期望发生的事情。

## 实际行为

清晰简洁地描述实际发生的事情。

## 环境信息

- OS: [例如 macOS 12.0]
- Node.js: [例如 18.0.0]
- TypeScript: [例如 5.0.0]
- 包版本: [例如 @ilhamtahir/ts-mapper@0.1.0]

## 附加信息

添加任何其他相关信息或截图。
```

### ✨ 功能请求

有新功能想法？我们很乐意听到：

1. 检查是否已有类似的功能请求
2. 清晰描述功能的用途和价值
3. 提供使用场景和示例
4. 考虑向后兼容性

### 📝 文档改进

文档改进包括：

- 修复错别字和语法错误
- 改进现有文档的清晰度
- 添加缺失的文档
- 更新过时的信息
- 添加更多示例

### 💻 代码贡献

#### 开发流程

1. **Fork 项目**

   ```bash
   # 在 GitHub 上 fork 项目
   git clone https://github.com/YOUR_USERNAME/nestjs-mapper.git
   cd nestjs-mapper
   ```

2. **创建功能分支**

   ```bash
   git checkout -b feature/your-feature-name
   # 或
   git checkout -b fix/your-bug-fix
   ```

3. **开发和测试**

   ```bash
   # 安装依赖
   pnpm install

   # 开发您的功能
   # ...

   # 运行测试
   pnpm test

   # 代码质量检查
   pnpm lint
   pnpm format
   pnpm type-check
   ```

4. **提交更改**

   ```bash
   git add .
   git commit -m "feat: add new mapping feature"
   ```

5. **推送并创建 PR**
   ```bash
   git push origin feature/your-feature-name
   # 在 GitHub 上创建 Pull Request
   ```

#### 代码规范

- 使用 TypeScript 编写所有代码
- 遵循现有的代码风格（ESLint + Prettier）
- 为新功能添加类型定义
- 编写清晰的注释和文档字符串
- 保持向后兼容性

#### 提交信息规范

我们使用 [Conventional Commits](https://conventionalcommits.org/) 规范：

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**类型：**

- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更改
- `style`: 代码格式更改（不影响功能）
- `refactor`: 代码重构
- `test`: 添加或修改测试
- `chore`: 构建过程或辅助工具的变动

**示例：**

```
feat(core): add support for custom transformation strategies

fix(nestjs): resolve circular dependency issue in mapper injection

docs: update getting started guide with new examples

test(core): add unit tests for nested path mapping
```

## 测试

### 运行测试

```bash
# 运行所有测试
pnpm test

# 运行特定包的测试
pnpm --filter @ilhamtahir/ts-mapper test
pnpm --filter @ilhamtahir/nestjs-mapper test

# 运行测试并生成覆盖率报告
pnpm test:coverage
```

### 编写测试

- 为新功能编写单元测试
- 确保测试覆盖率不降低
- 使用描述性的测试名称
- 测试边界情况和错误处理

**测试示例：**

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

## 发布流程

### 版本管理

我们使用 [Semantic Versioning](https://semver.org/)：

- `MAJOR`: 不兼容的 API 更改
- `MINOR`: 向后兼容的功能添加
- `PATCH`: 向后兼容的 bug 修复

### 发布步骤

```bash
# 1. 确保所有检查通过
pnpm pre-release

# 2. 更新版本号
pnpm version:patch  # 或 version:minor, version:major

# 3. 发布到 npm
pnpm release

# 4. 推送到 GitHub
git push origin main --tags
```

## 社区准则

### 行为准则

- 保持友善和尊重
- 欢迎新贡献者
- 建设性地提供反馈
- 专注于对项目最有利的事情

### 沟通渠道

- **GitHub Issues**: Bug 报告和功能请求
- **GitHub Discussions**: 一般讨论和问题
- **Pull Requests**: 代码审查和讨论

## 获得帮助

如果您在贡献过程中遇到问题：

1. 查看现有的 [Issues](https://github.com/ilhamtahir/nestjs-mapper/issues)
2. 搜索 [Discussions](https://github.com/ilhamtahir/nestjs-mapper/discussions)
3. 创建新的 Issue 或 Discussion
4. 在 PR 中 @mention 维护者

## 致谢

感谢所有为 ts-mapper 项目做出贡献的开发者！您的贡献让这个项目变得更好。

### 贡献者

- [IlhamTahir](https://github.com/ilhamtahir) - 项目创建者和维护者

---

再次感谢您的贡献！🎉
