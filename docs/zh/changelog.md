# 更新日志

所有重要的项目更改都将记录在此文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
并且本项目遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [未发布]

### 新增
- 完整的文档站点，基于 VitePress 构建
- 中文文档支持
- 交互式示例和代码片段
- API 参考文档

### 改进
- 优化了文档结构和导航
- 添加了更多使用示例
- 改进了错误处理说明

## [0.1.0] - 2024-01-15

### 新增

#### @ilhamtahir/ts-mapper (核心包)
- ✨ `@Mapper()` 装饰器：标记类为映射器
- ✨ `@Mapping()` 装饰器：定义字段映射规则
- ✨ `transform()` 函数：执行对象映射转换
- ✨ `createMapperProxy()` 函数：创建支持抽象类的代理对象
- ✨ 自动字段映射：字段名相同时自动赋值
- ✨ 嵌套路径支持：使用点号语法访问嵌套属性
- ✨ 类型安全：完整的 TypeScript 类型支持
- ✨ 元数据存储：管理映射规则和 Mapper 注册

#### @ilhamtahir/nest-mapper (NestJS 集成包)
- ✨ NestJS 版本的 `@Mapper()` 装饰器：自动添加 `@Injectable()` 支持
- ✨ `MapperModule`：提供自动注册和依赖注入配置
- ✨ `MapperModule.forRoot()`：全局注册所有 Mapper
- ✨ `MapperModule.forFeature()`：功能模块级别的 Mapper 注册
- ✨ 抽象类支持：支持抽象方法自动实现
- ✨ 空方法体支持：自动检测并实现空方法体
- ✨ 依赖注入：完整的 NestJS DI 系统集成
- ✨ 循环依赖处理：支持 `forwardRef()` 和延迟加载

#### 示例项目
- ✨ 完整的 NestJS 示例应用
- ✨ 用户、订单、产品等实体映射示例
- ✨ 抽象类和混合模式示例
- ✨ 循环依赖处理示例

### 功能特性

#### 核心映射功能
- **自动映射**：字段名相同且类型兼容时自动映射
- **显式映射**：通过 `@Mapping()` 装饰器定义映射规则
- **嵌套映射**：支持 `profile.bio` 等嵌套路径访问
- **类型安全**：编译期类型检查和 IntelliSense 支持
- **批量转换**：支持数组和集合的批量映射

#### 高级功能
- **抽象类支持**：可以定义抽象 Mapper 类
- **自动实现**：空方法体和抽象方法自动调用 transform
- **自定义逻辑**：保留具体方法的自定义实现
- **代理模式**：使用 Proxy 实现透明的方法拦截

#### NestJS 集成
- **依赖注入**：Mapper 可以注入到任何 NestJS 组件
- **模块化**：支持全局和功能模块级别的注册
- **作用域支持**：支持单例、请求和瞬态作用域
- **循环依赖**：优雅处理 Mapper 间的循环依赖

### 开发工具

#### 构建系统
- TypeScript 编译配置
- ESLint 代码检查
- Prettier 代码格式化
- Husky Git hooks
- Conventional Commits 提交规范

#### 包管理
- pnpm workspace 多包管理
- 自动化构建和发布流程
- 版本管理和变更日志生成

#### 示例和文档
- 完整的使用示例
- API 文档和类型定义
- 最佳实践指南

### 技术规格

#### 兼容性
- Node.js >= 16.0.0
- TypeScript >= 5.0.0
- NestJS >= 10.0.0

#### 依赖
- `reflect-metadata`: 元数据反射支持
- `@nestjs/common`: NestJS 核心功能

#### 包大小
- `@ilhamtahir/ts-mapper`: ~15KB (gzipped)
- `@ilhamtahir/nest-mapper`: ~5KB (gzipped)

### 性能特性
- **元数据缓存**：映射规则在首次使用时缓存
- **单例模式**：Mapper 实例在应用生命周期中复用
- **懒加载**：支持按需加载 Mapper
- **批量优化**：优化大量数据的转换性能

### 已知限制
- 抽象方法不能直接使用装饰器（TypeScript 限制）
- 需要启用 `experimentalDecorators` 和 `emitDecoratorMetadata`
- 循环引用需要特殊处理以避免无限递归

## 路线图

### v0.2.0 (计划中)
- [ ] 条件映射支持
- [ ] 自定义转换器注册
- [ ] 映射配置文件支持
- [ ] 性能监控和指标
- [ ] 更多示例和模板

### v0.3.0 (计划中)
- [ ] 异步映射支持
- [ ] 流式处理大数据集
- [ ] 插件系统
- [ ] 可视化映射配置工具

### v1.0.0 (计划中)
- [ ] 稳定的 API
- [ ] 完整的测试覆盖
- [ ] 生产环境优化
- [ ] 详细的性能基准

## 贡献者

感谢所有为此项目做出贡献的开发者：

- [IlhamTahir](https://github.com/ilhamtahir) - 项目创建者和主要维护者

## 支持

如果您遇到问题或有功能请求，请：

1. 查看 [文档](https://docs.ilham.dev/ts-mapper)
2. 搜索现有的 [Issues](https://github.com/ilhamtahir/nest-mapper/issues)
3. 创建新的 Issue 或 Discussion
4. 参与社区讨论

## 许可证

本项目基于 [MIT 许可证](https://github.com/ilhamtahir/nest-mapper/blob/main/LICENSE) 开源。

---

**注意**：此更新日志遵循 [Keep a Changelog](https://keepachangelog.com/) 格式。版本号遵循 [语义化版本](https://semver.org/) 规范。
