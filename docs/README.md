# ts-mapper Documentation

This is the official documentation for the ts-mapper project, built with VitePress.

## Local Development

### Install Dependencies

```bash
pnpm install
```

### Start Development Server

```bash
pnpm docs:dev
```

The documentation will run on the local development server.

### Build Documentation

```bash
pnpm docs:build
```

The built documentation will be output to the `docs/.vitepress/dist` directory.

### Preview Build Results

```bash
pnpm docs:preview
```

## Documentation Structure

```
docs/
├── .vitepress/
│   ├── config.mjs          # VitePress configuration
│   └── dist/               # Build output directory
├── en/                     # English documentation
│   ├── guide/
│   │   ├── core/           # ts-mapper core functionality guide
│   │   │   ├── getting-started.md
│   │   │   ├── transform.md
│   │   │   ├── mapping.md
│   │   │   └── custom-strategy.md
│   │   └── nest/           # nestjs-mapper NestJS integration guide
│   │       ├── getting-started.md
│   │       ├── injection.md
│   │       ├── abstract-class.md
│   │       └── circular-deps.md
│   ├── api/
│   │   ├── ts-mapper.md    # ts-mapper API documentation
│   │   └── nestjs-mapper.md  # nestjs-mapper API documentation
│   ├── contributing.md     # Contributing guide
│   └── changelog.md        # Changelog
├── zh/                     # Chinese documentation
│   ├── guide/
│   │   ├── core/           # ts-mapper 核心功能指南
│   │   └── nest/           # nestjs-mapper NestJS 集成指南
│   ├── api/
│   ├── contributing.md     # 贡献指南
│   └── changelog.md        # 更新日志
├── index.md                # Homepage (English)
├── README.md               # This file (English)
└── README.zh-CN.md         # Chinese README
```

## Writing Documentation

### Markdown Syntax

The documentation uses standard Markdown syntax, supporting:

- Code highlighting
- Tables
- Links
- Images
- Alert boxes (:::tip, :::warning, :::danger)

### Code Examples

Use code blocks to show examples:

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

### Alert Boxes

```markdown
::: tip Tip
This is a tip box
:::

::: warning Warning
This is a warning box
:::

::: danger Danger
This is a danger alert box
:::
```

### Internal Links

Use relative paths to link to other documentation pages:

```markdown
[Getting Started](./en/guide/core/getting-started.md)
[API Documentation](./en/api/ts-mapper.md)
```

## Multi-language Support

This documentation supports both English and Chinese:

- **English**: Default language, accessible at root path
- **Chinese**: Accessible under `/zh/` path
- **Language Switching**: Users can switch languages using the language selector in the navigation

### Adding New Languages

To add a new language:

1. Create a new directory under `docs/` (e.g., `docs/fr/` for French)
2. Copy the documentation structure from `docs/en/`
3. Translate the content
4. Update `docs/.vitepress/config.mjs` to include the new locale

## Deployment

The documentation can be deployed to any static website hosting service:

### GitHub Pages

1. Build documentation: `pnpm docs:build`
2. Push the contents of `docs/.vitepress/dist` directory to the `gh-pages` branch

### Vercel

1. Connect GitHub repository
2. Set build command: `pnpm docs:build`
3. Set output directory: `docs/.vitepress/dist`

### Netlify

1. Connect GitHub repository
2. Set build command: `pnpm docs:build`
3. Set publish directory: `docs/.vitepress/dist`

## Contributing

We welcome documentation improvements:

1. Fork the project
2. Create a feature branch
3. Edit documentation
4. Submit a Pull Request

For detailed information, please refer to the contributing guide.

## Available Scripts

- `pnpm docs:dev` - Start development server
- `pnpm docs:build` - Build documentation for production
- `pnpm docs:preview` - Preview built documentation locally

## File Organization

### English Documentation (`/en/`)

- All English content is organized under the `en/` directory
- Follows the same structure as the Chinese documentation
- Uses English navigation and interface elements

### Chinese Documentation (`/zh/`)

- All Chinese content is organized under the `zh/` directory
- Maintains consistency with English content structure
- Uses Chinese navigation and interface elements

### Shared Resources

- Images and assets are shared between languages
- Configuration files support both languages
- Build scripts work for all languages

## Best Practices

1. **Consistency**: Keep content structure consistent between languages
2. **Translation Quality**: Ensure translations are accurate and natural
3. **Link Maintenance**: Update internal links when moving or renaming files
4. **Code Examples**: Keep code examples identical across languages, only translate comments
5. **Regular Updates**: Keep both language versions up to date

## Troubleshooting

### Build Errors

- Check for dead links in markdown files
- Ensure all referenced files exist
- Verify VitePress configuration syntax

### Development Issues

- Clear cache: `rm -rf node_modules/.cache`
- Reinstall dependencies: `pnpm install`
- Check Node.js version compatibility

### Language Switching

- Verify locale configuration in `config.mjs`
- Check directory structure matches configuration
- Ensure navigation links use correct paths

For more help, please check the [VitePress documentation](https://vitepress.dev/) or create an issue in the repository.
