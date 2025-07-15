# ts-mapper 文档

这是 ts-mapper 项目的官方文档，基于 VitePress 构建。

## 本地开发

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm docs:dev
```

文档将在本地开发服务器上运行。

### 构建文档

```bash
pnpm docs:build
```

构建的文档将输出到 `docs/.vitepress/dist` 目录。

### 预览构建结果

```bash
pnpm docs:preview
```

## 文档结构

```
docs/
├── .vitepress/
│   ├── config.mjs          # VitePress 配置
│   └── dist/               # 构建输出目录
├── guide/
│   ├── core/               # ts-mapper 核心功能指南
│   │   ├── getting-started.md
│   │   ├── transform.md
│   │   ├── mapping.md
│   │   └── custom-strategy.md
│   └── nest/               # nestjs-mapper NestJS 集成指南
│       ├── getting-started.md
│       ├── injection.md
│       ├── abstract-class.md
│       └── circular-deps.md
├── api/
│   ├── ts-mapper.md        # ts-mapper API 文档
│   └── nestjs-mapper.md      # nestjs-mapper API 文档
├── index.md                # 首页
├── contributing.md         # 贡献指南
├── changelog.md            # 更新日志
└── README.md               # 本文件
```

## 编写文档

### Markdown 语法

文档使用标准的 Markdown 语法，支持：

- 代码高亮
- 表格
- 链接
- 图片
- 提示框（::: tip、::: warning、::: danger）

### 代码示例

使用代码块展示示例：

````markdown
```typescript
@Mapper()
export class UserMapper {
  @Mapping({ source: 'fullName', target: 'name' })
  toDto(entity: UserEntity): UserDto {
    return transform(this, 'toDto', entity, UserDto);
  }
}
```
````

### 提示框

```markdown
::: tip 提示
这是一个提示框
:::

::: warning 警告
这是一个警告框
:::

::: danger 危险
这是一个危险提示框
:::
```

### 内部链接

使用相对路径链接到其他文档页面：

```markdown
[快速开始](./guide/core/getting-started.md)
[API 文档](./api/ts-mapper.md)
```

## 部署

文档可以部署到任何静态网站托管服务：

### GitHub Pages

1. 构建文档：`pnpm docs:build`
2. 将 `docs/.vitepress/dist` 目录内容推送到 `gh-pages` 分支

### Vercel

1. 连接 GitHub 仓库
2. 设置构建命令：`pnpm docs:build`
3. 设置输出目录：`docs/.vitepress/dist`

### Netlify

1. 连接 GitHub 仓库
2. 设置构建命令：`pnpm docs:build`
3. 设置发布目录：`docs/.vitepress/dist`

## 贡献

欢迎贡献文档改进：

1. Fork 项目
2. 创建功能分支
3. 编辑文档
4. 提交 Pull Request

详细信息请参考贡献指南。
