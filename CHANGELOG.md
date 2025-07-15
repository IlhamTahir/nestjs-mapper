# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-07-15

### ✨ Features

- **Abstract Class Support**: 支持使用 abstract class 声明 Mapper
- **Proxy Auto Implementation**: 空方法体自动调用 transform()
- **Custom Method Preservation**: 非空方法体保留原始逻辑
- **Enhanced NestJS Integration**: 完善的 NestJS 依赖注入支持
- **Automatic Field Mapping**: 字段名相同时自动赋值
- **Nested Path Support**: 支持 `profile.bio` 等嵌套字段映射
- **TypeScript Safety**: 完全基于 TypeScript，提供类型安全保障

### 🛠 Technical Improvements

- **createMapperProxy()**: 新增代理工具函数
- **Smart Method Detection**: 智能检测空方法体和自定义方法
- **Decorator-Driven**: `@Mapper()` 和 `@Mapping()` 装饰器
- **Metadata Storage**: 优化的元数据存储系统

### 📦 Packages

- `@ilhamtahir/ts-mapper`: 核心映射库
- `@ilhamtahir/nest-mapper`: NestJS 集成包

### 🔧 Development Tools

- **ESLint + Prettier**: 代码质量和格式化
- **Husky + lint-staged**: Git hooks 自动化
- **Conventional Commits**: 标准化提交消息
- **Standard Version**: 自动版本管理和 changelog 生成
- **GitHub Actions**: CI/CD 自动化



