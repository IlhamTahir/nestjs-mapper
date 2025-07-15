# 📚 文档部署指南

本文档说明如何设置和部署 ts-mapper 项目文档到 GitHub Pages。

## 🚀 自动部署设置

### 1. 启用 GitHub Pages

1. 进入您的 GitHub 仓库
2. 点击 **Settings** 标签页
3. 在左侧菜单中找到 **Pages**
4. 在 **Source** 部分选择 **GitHub Actions**

### 2. 工作流配置

项目已经配置了自动部署工作流 (`.github/workflows/docs.yml`)，它会：

- ✅ 当推送到 `main` 分支且 `docs/` 目录有变更时自动触发
- ✅ 使用 pnpm 安装依赖
- ✅ 构建 VitePress 文档
- ✅ 自动部署到 GitHub Pages

### 3. 触发条件

自动部署会在以下情况触发：

```yaml
on:
  push:
    branches:
      - main
    paths:
      - 'docs/**'
      - '.github/workflows/docs.yml'
  workflow_dispatch: # 手动触发
```

### 4. 手动触发部署

如果需要手动触发部署：

1. 进入 GitHub 仓库的 **Actions** 标签页
2. 选择 **📚 Deploy Documentation** 工作流
3. 点击 **Run workflow** 按钮

## 🔧 本地开发

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm docs:dev
```

文档将在 `http://localhost:5173` 运行。

### 构建文档

```bash
pnpm docs:build
```

构建结果将输出到 `docs/.vitepress/dist` 目录。

### 预览构建结果

```bash
pnpm docs:preview
```

## 🌐 访问部署的文档

部署成功后，文档将可以通过以下地址访问：

```
https://[您的用户名].github.io/nestjs-mapper/
```

例如：`https://ilhamtahir.github.io/nestjs-mapper/`

## 📝 配置说明

### VitePress 配置

文档的 VitePress 配置位于 `docs/.vitepress/config.mjs`，其中包含：

- **base 路径**：自动根据环境设置正确的基础路径
- **多语言支持**：支持英文和中文
- **主题配置**：导航、侧边栏等

### GitHub Actions 工作流

工作流配置位于 `.github/workflows/docs.yml`，包含：

- **构建步骤**：安装依赖、构建文档
- **部署步骤**：上传到 GitHub Pages
- **权限设置**：正确的 GitHub Pages 权限

## 🔍 故障排除

### 常见问题

1. **部署失败**
   - 检查 GitHub Pages 是否已启用
   - 确认工作流权限设置正确
   - 查看 Actions 日志获取详细错误信息

2. **样式或资源加载失败**
   - 确认 `base` 路径配置正确
   - 检查静态资源路径是否正确

3. **构建失败**
   - 检查 pnpm 版本是否匹配
   - 确认所有依赖都已正确安装
   - 查看构建日志获取详细错误信息

### 查看部署状态

1. 进入 GitHub 仓库的 **Actions** 标签页
2. 查看最新的工作流运行状态
3. 点击具体的工作流查看详细日志

## 📋 部署清单

在首次设置时，请确认以下项目：

- [ ] GitHub Pages 已启用并设置为 "GitHub Actions"
- [ ] 工作流文件 `.github/workflows/docs.yml` 已提交
- [ ] VitePress 配置中的 `base` 路径正确
- [ ] 推送代码到 `main` 分支触发部署
- [ ] 部署成功并可以访问文档站点

## 🎯 下一步

- 📝 编写和更新文档内容
- 🎨 自定义文档主题和样式
- 🔗 添加更多导航和链接
- 📊 集成文档分析工具
