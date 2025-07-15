# Nested & Circular Dependencies

In complex business scenarios, you often encounter nested relationships and circular dependencies between objects. This chapter explains how to elegantly handle these situations in `@ilhamtahir/nest-mapper`.

## Nested Object Mapping

### Basic Nested Mapping

```typescript
// Entity definitions
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

// DTO definitions
interface UserDto {
  id: number;
  name: string;
  bio: string;
  avatar: string;
  theme: string;
  notifications: boolean;
  postCount: number;
}

// Mapper implementation
@Mapper()
export abstract class UserMapper {
  @Mapping({ source: 'profile.bio', target: 'bio' })
  @Mapping({ source: 'profile.avatar', target: 'avatar' })
  @Mapping({ source: 'profile.settings.theme', target: 'theme' })
  @Mapping({ source: 'profile.settings.notifications', target: 'notifications' })
  abstract toDto(entity: UserEntity): UserDto;

  // Custom method to handle array length
  toDtoWithPostCount(entity: UserEntity): UserDto {
    const dto = this.toDto(entity);
    dto.postCount = entity.posts?.length || 0;
    return dto;
  }
}
```

## Circular Dependency Handling

### User-Post Circular Reference

```typescript
// Entity definitions (with circular references)
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

### Solution 1: Layered Mapping

```typescript
// Basic DTOs (without circular references)
interface UserBasicDto {
  id: number;
  name: string;
}

interface PostBasicDto {
  id: number;
  title: string;
  content: string;
}

// Complete DTOs (with references)
interface UserDto extends UserBasicDto {
  posts: PostBasicDto[];
  favoritePost?: PostBasicDto;
}

interface PostDto extends PostBasicDto {
  author: UserBasicDto;
  commentCount: number;
}

// Mapper implementation
@Mapper()
export abstract class UserMapper {
  constructor(
    @Inject(forwardRef(() => PostMapper))
    private readonly postMapper: PostMapper
  ) {}

  // Basic mapping (no circular dependencies)
  abstract toBasicDto(entity: UserEntity): UserBasicDto;

  // Complete mapping (handle nested objects)
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

### Solution 2: Lazy Loading

```typescript
@Mapper()
export class UserMapper {
  constructor(private readonly moduleRef: ModuleRef) {}

  async toDtoWithPosts(entity: UserEntity): Promise<UserDto> {
    // Lazy load PostMapper to avoid circular dependency
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

### Solution 3: Context Control

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

    // Prevent infinite recursion
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

## Performance Optimization Strategies

### Batch Loading Optimization

```typescript
@Mapper()
export class OptimizedUserMapper {
  constructor(
    private readonly postService: PostService,
    private readonly commentService: CommentService
  ) {}

  async toDtoWithDetails(userIds: number[]): Promise<UserDto[]> {
    // Batch load user data
    const users = await this.userService.findByIds(userIds);
    const userMap = new Map(users.map(user => [user.id, user]));

    // Batch load related data
    const allPostIds = users.flatMap(user => user.posts?.map(p => p.id) || []);
    const posts = await this.postService.findByIds(allPostIds);
    const postMap = new Map(posts.map(post => [post.id, post]));

    // Batch conversion
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

## Error Handling

### Circular Dependency Detection

```typescript
@Mapper()
export class SafeUserMapper {
  private processingStack = new Set<string>();

  toDto(entity: UserEntity): UserDto {
    const key = `user-${entity.id}`;

    if (this.processingStack.has(key)) {
      throw new Error(
        `Circular dependency detected: ${Array.from(this.processingStack).join(' -> ')} -> ${key}`
      );
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
    // Mapping logic
    return {
      id: entity.id,
      name: entity.name,
    };
  }
}
```

## Testing Strategy

### Circular Dependency Testing

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

    user.posts = [post]; // Create circular reference

    // Should handle circular reference without stack overflow
    expect(() => {
      const userDto = userMapper.toDto(user);
      expect(userDto.id).toBe(1);
      expect(userDto.posts).toHaveLength(1);
    }).not.toThrow();
  });
});
```

## Best Practices

1. **Layered design**: Use basic DTOs and complete DTOs to separate circular dependencies
2. **Depth control**: Limit mapping depth to avoid infinite recursion
3. **Caching strategy**: Use caching appropriately to improve performance
4. **Error handling**: Provide graceful fallback options
5. **Batch optimization**: Use batch loading for large data sets
6. **Test coverage**: Thoroughly test circular dependency scenarios

## Next Steps

- Check [API documentation](../../api/nest-mapper) for complete interfaces
- Explore [core functionality](../core/getting-started) advanced usage
- Learn about [dependency injection](./injection) best practices
