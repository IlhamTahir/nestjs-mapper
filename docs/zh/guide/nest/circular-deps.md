# 嵌套与循环依赖处理

在复杂的业务场景中，经常会遇到对象间的嵌套关系和循环依赖。本章介绍如何在 `@ilhamtahir/nestjs-mapper` 中优雅地处理这些情况。

## 嵌套对象映射

### 基本嵌套映射

```typescript
// 实体定义
interface UserEntity {
  id: number;
  name: string;
  profile: ProfileEntity;
  posts: PostEntity[];
}

interface ProfileEntity {
  bio: string;
  avatar: string;
  settings: SettingsEntity;
}

interface SettingsEntity {
  theme: string;
  notifications: boolean;
}

// DTO 定义
interface UserDto {
  id: number;
  name: string;
  bio: string;
  avatar: string;
  theme: string;
  notifications: boolean;
  postCount: number;
}

// Mapper 实现
@Mapper()
export abstract class UserMapper {
  @Mapping({ source: 'profile.bio', target: 'bio' })
  @Mapping({ source: 'profile.avatar', target: 'avatar' })
  @Mapping({ source: 'profile.settings.theme', target: 'theme' })
  @Mapping({ source: 'profile.settings.notifications', target: 'notifications' })
  abstract toDto(entity: UserEntity): UserDto;

  // 自定义方法处理数组长度
  toDtoWithPostCount(entity: UserEntity): UserDto {
    const dto = this.toDto(entity);
    dto.postCount = entity.posts?.length || 0;
    return dto;
  }
}
```

### 深层嵌套映射

```typescript
interface CompanyEntity {
  id: number;
  name: string;
  departments: DepartmentEntity[];
}

interface DepartmentEntity {
  id: number;
  name: string;
  manager: UserEntity;
  employees: UserEntity[];
  budget: {
    total: number;
    spent: number;
    categories: {
      salary: number;
      equipment: number;
      training: number;
    };
  };
}

interface CompanyDto {
  id: number;
  name: string;
  departmentCount: number;
  totalEmployees: number;
  totalBudget: number;
  departments: DepartmentSummaryDto[];
}

interface DepartmentSummaryDto {
  id: number;
  name: string;
  managerName: string;
  employeeCount: number;
  budgetUtilization: number;
}

@Mapper()
export class CompanyMapper {
  constructor(private readonly departmentMapper: DepartmentMapper) {}

  toDto(entity: CompanyEntity): CompanyDto {
    return {
      id: entity.id,
      name: entity.name,
      departmentCount: entity.departments.length,
      totalEmployees: this.calculateTotalEmployees(entity.departments),
      totalBudget: this.calculateTotalBudget(entity.departments),
      departments: entity.departments.map(dept =>
        this.departmentMapper.toSummaryDto(dept)
      ),
    };
  }

  private calculateTotalEmployees(departments: DepartmentEntity[]): number {
    return departments.reduce((total, dept) => total + dept.employees.length, 0);
  }

  private calculateTotalBudget(departments: DepartmentEntity[]): number {
    return departments.reduce((total, dept) => total + dept.budget.total, 0);
  }
}

@Mapper()
export abstract class DepartmentMapper {
  constructor(private readonly userMapper: UserMapper) {}

  @Mapping({ source: 'manager.name', target: 'managerName' })
  abstract toSummaryDto(entity: DepartmentEntity): DepartmentSummaryDto;

  toSummaryDtoWithCalculations(entity: DepartmentEntity): DepartmentSummaryDto {
    const dto = this.toSummaryDto(entity);
    dto.employeeCount = entity.employees.length;
    dto.budgetUtilization = (entity.budget.spent / entity.budget.total) * 100;
    return dto;
  }
}
```

## 循环依赖处理

### 用户-文章循环依赖

```typescript
// 实体定义（存在循环引用）
interface UserEntity {
  id: number;
  name: string;
  posts: PostEntity[];
  favoritePost?: PostEntity;
}

interface PostEntity {
  id: number;
  title: string;
  content: string;
  author: UserEntity;
  comments: CommentEntity[];
}

interface CommentEntity {
  id: number;
  content: string;
  author: UserEntity;
  post: PostEntity;
}
```

### 解决方案 1：分层映射

```typescript
// 基础 DTO（不包含循环引用）
interface UserBasicDto {
  id: number;
  name: string;
}

interface PostBasicDto {
  id: number;
  title: string;
  content: string;
}

// 完整 DTO（包含引用）
interface UserDto extends UserBasicDto {
  posts: PostBasicDto[];
  favoritePost?: PostBasicDto;
}

interface PostDto extends PostBasicDto {
  author: UserBasicDto;
  commentCount: number;
}

// Mapper 实现
@Mapper()
export abstract class UserMapper {
  constructor(
    @Inject(forwardRef(() => PostMapper))
    private readonly postMapper: PostMapper
  ) {}

  // 基础映射（无循环依赖）
  abstract toBasicDto(entity: UserEntity): UserBasicDto;

  // 完整映射（处理嵌套对象）
  toDto(entity: UserEntity): UserDto {
    const basicDto = this.toBasicDto(entity);

    return {
      ...basicDto,
      posts: entity.posts?.map(post => this.postMapper.toBasicDto(post)) || [],
      favoritePost: entity.favoritePost
        ? this.postMapper.toBasicDto(entity.favoritePost)
        : undefined,
    };
  }
}

@Mapper()
export abstract class PostMapper {
  constructor(
    @Inject(forwardRef(() => UserMapper))
    private readonly userMapper: UserMapper
  ) {}

  abstract toBasicDto(entity: PostEntity): PostBasicDto;

  toDto(entity: PostEntity): PostDto {
    const basicDto = this.toBasicDto(entity);

    return {
      ...basicDto,
      author: this.userMapper.toBasicDto(entity.author),
      commentCount: entity.comments?.length || 0,
    };
  }
}
```

### 解决方案 2：延迟加载

```typescript
@Mapper()
export class UserMapper {
  constructor(private readonly moduleRef: ModuleRef) {}

  async toDtoWithPosts(entity: UserEntity): Promise<UserDto> {
    // 延迟获取 PostMapper 避免循环依赖
    const postMapper = await this.moduleRef.get(PostMapper, { strict: false });

    const dto = this.toBasicDto(entity);

    return {
      ...dto,
      posts: entity.posts?.map(post => postMapper.toBasicDto(post)) || [],
    };
  }

  toBasicDto(entity: UserEntity): UserBasicDto {
    return {
      id: entity.id,
      name: entity.name,
    };
  }
}
```

### 解决方案 3：上下文控制

```typescript
interface MappingContext {
  depth: number;
  maxDepth: number;
  visited: Set<string>;
}

@Mapper()
export class UserMapper {
  constructor(private readonly postMapper: PostMapper) {}

  toDto(
    entity: UserEntity,
    context: MappingContext = { depth: 0, maxDepth: 3, visited: new Set() }
  ): UserDto {
    const key = `user-${entity.id}`;

    // 防止无限递归
    if (context.visited.has(key) || context.depth >= context.maxDepth) {
      return this.toBasicDto(entity);
    }

    context.visited.add(key);
    context.depth++;

    const dto: UserDto = {
      id: entity.id,
      name: entity.name,
      posts: entity.posts?.map(post => this.postMapper.toDto(post, { ...context })) || [],
    };

    context.depth--;
    context.visited.delete(key);

    return dto;
  }

  toBasicDto(entity: UserEntity): UserBasicDto {
    return {
      id: entity.id,
      name: entity.name,
    };
  }
}
```

## 性能优化策略

### 批量加载优化

```typescript
@Mapper()
export class OptimizedUserMapper {
  constructor(
    private readonly postService: PostService,
    private readonly commentService: CommentService
  ) {}

  async toDtoWithDetails(userIds: number[]): Promise<UserDto[]> {
    // 批量加载用户数据
    const users = await this.userService.findByIds(userIds);
    const userMap = new Map(users.map(user => [user.id, user]));

    // 批量加载关联数据
    const allPostIds = users.flatMap(user => user.posts?.map(p => p.id) || []);
    const posts = await this.postService.findByIds(allPostIds);
    const postMap = new Map(posts.map(post => [post.id, post]));

    // 批量转换
    return users.map(user => this.toDtoWithPreloadedData(user, postMap));
  }

  private toDtoWithPreloadedData(user: UserEntity, postMap: Map<number, PostEntity>): UserDto {
    return {
      id: user.id,
      name: user.name,
      posts:
        user.posts
          ?.map(post => {
            const fullPost = postMap.get(post.id);
            return fullPost ? this.postMapper.toBasicDto(fullPost) : null;
          })
          .filter(Boolean) || [],
    };
  }
}
```

### 缓存策略

```typescript
@Mapper()
export class CachedUserMapper {
  private cache = new Map<string, any>();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5分钟

  toDto(entity: UserEntity): UserDto {
    const cacheKey = `user-dto-${entity.id}-${entity.updatedAt?.getTime()}`;

    // 检查缓存
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data;
    }

    // 执行映射
    const dto = this.performMapping(entity);

    // 缓存结果
    this.cache.set(cacheKey, {
      data: dto,
      timestamp: Date.now(),
    });

    return dto;
  }

  private performMapping(entity: UserEntity): UserDto {
    // 实际的映射逻辑
    return {
      id: entity.id,
      name: entity.name,
      // ... 其他字段
    };
  }
}
```

## 错误处理

### 循环依赖检测

```typescript
@Mapper()
export class SafeUserMapper {
  private processingStack = new Set<string>();

  toDto(entity: UserEntity): UserDto {
    const key = `user-${entity.id}`;

    if (this.processingStack.has(key)) {
      throw new Error(`检测到循环依赖: ${Array.from(this.processingStack).join(' -> ')} -> ${key}`);
    }

    this.processingStack.add(key);

    try {
      const dto = this.performMapping(entity);
      return dto;
    } finally {
      this.processingStack.delete(key);
    }
  }

  private performMapping(entity: UserEntity): UserDto {
    // 映射逻辑
    return {
      id: entity.id,
      name: entity.name,
    };
  }
}
```

### 优雅降级

```typescript
@Mapper()
export class ResilientUserMapper {
  toDto(entity: UserEntity): UserDto {
    try {
      return this.fullMapping(entity);
    } catch (error) {
      console.warn('完整映射失败，使用基础映射:', error.message);
      return this.basicMapping(entity);
    }
  }

  private fullMapping(entity: UserEntity): UserDto {
    // 完整的映射逻辑（可能包含复杂的嵌套处理）
    return {
      id: entity.id,
      name: entity.name,
      posts: entity.posts?.map(post => this.postMapper.toDto(post)) || [],
      // ... 其他复杂字段
    };
  }

  private basicMapping(entity: UserEntity): UserDto {
    // 基础映射（安全的回退方案）
    return {
      id: entity.id,
      name: entity.name,
      posts: [],
    };
  }
}
```

## 测试策略

### 循环依赖测试

```typescript
describe('Circular Dependency Handling', () => {
  let userMapper: UserMapper;
  let postMapper: PostMapper;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [MapperModule.forRoot()],
    }).compile();

    userMapper = module.get<UserMapper>(UserMapper);
    postMapper = module.get<PostMapper>(PostMapper);
  });

  it('should handle circular references without infinite recursion', () => {
    const user: UserEntity = {
      id: 1,
      name: 'John Doe',
      posts: [],
    };

    const post: PostEntity = {
      id: 1,
      title: 'Test Post',
      content: 'Content',
      author: user,
      comments: [],
    };

    user.posts = [post]; // 创建循环引用

    // 应该能够处理循环引用而不会导致栈溢出
    expect(() => {
      const userDto = userMapper.toDto(user);
      expect(userDto.id).toBe(1);
      expect(userDto.posts).toHaveLength(1);
    }).not.toThrow();
  });
});
```

## 最佳实践

1. **分层设计**: 使用基础 DTO 和完整 DTO 分离循环依赖
2. **深度控制**: 限制映射深度避免无限递归
3. **缓存策略**: 合理使用缓存提高性能
4. **错误处理**: 提供优雅的降级方案
5. **批量优化**: 对于大量数据使用批量加载
6. **测试覆盖**: 充分测试循环依赖场景

## 下一步

- 查看 [API 文档](../../api/nestjs-mapper) 了解完整接口
- 探索 [核心功能](../core/getting-started) 的高级用法
- 了解 [依赖注入](./injection) 的最佳实践
