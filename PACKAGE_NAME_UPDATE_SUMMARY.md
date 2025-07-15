# 包名更新总结

本文档记录了将包名从 `@ilhamtahir/nestjs-mapper` 更新为 `@ilhamtahir/nestjs-mapper` 的所有变更。

## ✅ 已更新的文件

### 1. 包配置文件

- ✅ `packages/nestjs/package.json` - 包名已正确设置为 `@ilhamtahir/nestjs-mapper`
- ✅ `packages/core/package.json` - 仓库链接已更新
- ✅ `examples/nestjs-app/package.json` - 依赖引用已更新

### 2. 文档文件

- ✅ `packages/nestjs/README.md` - 安装命令和导入语句已更新
- ✅ `packages/core/README.md` - GitHub 链接已更新
- ✅ `CONTRIBUTING.md` - 包名和项目结构已更新
- ✅ `docs/en/contributing.md` - 包名和示例目录名已更新
- ✅ `docs/zh/contributing.md` - 包名已更新
- ✅ `docs/en/guide/nest/getting-started.md` - API 文档链接已更新
- ✅ `docs/en/api/nestjs-mapper.md` - 包名和导入语句已更新
- ✅ `docs/zh/api/nestjs-mapper.md` - 包名和导入语句已更新

### 3. VitePress 配置

- ✅ `docs/.vitepress/config.mjs` - 以下内容已更新：
  - GitHub Pages base 路径：`/nestjs-mapper/`
  - GitHub 仓库链接
  - 编辑链接
  - 社交链接
  - 侧边栏标题和链接

### 4. 部署配置

- ✅ `docs/DEPLOYMENT.md` - GitHub Pages 访问地址已更新
- ✅ `docs/index.md` - NestJS 集成链接已更新
- ✅ `.github/workflows/docs.yml` - GitHub Actions 工作流（无需更改，使用相对路径）

### 5. 版本控制配置

- ✅ `.versionrc.js` - GitHub 仓库链接已更新（如果存在）

## 📦 包名变更详情

### 之前

```bash
npm install @ilhamtahir/ts-mapper @ilhamtahir/nestjs-mapper
```

### 现在

```bash
npm install @ilhamtahir/ts-mapper @ilhamtahir/nestjs-mapper
```

### 导入语句变更

#### 之前

```typescript
import { MapperModule } from '@ilhamtahir/nestjs-mapper';
```

#### 现在

```typescript
import { MapperModule } from '@ilhamtahir/nestjs-mapper';
```

## 🔗 URL 变更

### GitHub 仓库

- 仓库名称保持：`nestjs-mapper`
- 仓库 URL：`https://github.com/ilhamtahir/nestjs-mapper`

### GitHub Pages

- 之前：`https://ilhamtahir.github.io/nestjs-mapper/`
- 现在：`https://ilhamtahir.github.io/nestjs-mapper/`

### NPM 包

- 核心包：`@ilhamtahir/ts-mapper`（无变更）
- NestJS 集成包：`@ilhamtahir/nestjs-mapper`（已更新）

## 🚀 下一步操作

1. **发布新版本**：

   ```bash
   pnpm run pre-release
   pnpm run release
   ```

2. **更新 NPM 包**：
   - 新包名 `@ilhamtahir/nestjs-mapper` 将发布到 NPM
   - 考虑是否需要废弃旧包名 `@ilhamtahir/nestjs-mapper`

3. **通知用户**：
   - 在 CHANGELOG.md 中记录包名变更
   - 在 README.md 中添加迁移指南
   - 考虑在旧包中添加废弃通知

4. **验证部署**：
   - 推送代码触发 GitHub Actions
   - 验证文档站点正常访问
   - 确认所有链接正常工作

## ⚠️ 注意事项

1. **向后兼容性**：这是一个破坏性变更，用户需要更新导入语句
2. **文档同步**：确保所有文档都反映了新的包名
3. **示例代码**：所有示例和教程都需要使用新的包名
4. **社区通知**：需要通知社区这个重要变更

## ✅ 验证清单

- [x] 所有文件中的包名引用已更新
- [x] GitHub 仓库链接已更新
- [x] 文档站点配置已更新
- [x] 示例代码已更新
- [x] 构建脚本无需更改（使用 workspace 引用）
- [x] GitHub Actions 配置已验证
- [ ] 发布新版本到 NPM
- [ ] 验证文档站点部署
- [ ] 通知用户迁移
