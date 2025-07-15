# 自定义转换策略

虽然 ts-mapper 提供了强大的自动映射和装饰器配置功能，但有时你需要实现更复杂的转换逻辑。本章介绍如何在映射过程中添加自定义逻辑。

## 基本自定义逻辑

### 在 transform 后处理

最简单的方式是在 `transform()` 调用后添加自定义逻辑：

```typescript
@Mapper()
export class UserMapper {
  @Mapping({ source: 'fullName', target: 'name' })
  @Mapping({ source: 'profile.bio', target: 'bio' })
  toDto(entity: UserEntity): UserDto {
    // 执行基本映射
    const dto = transform(this, 'toDto', entity, UserDto);

    // 添加自定义逻辑
    dto.displayName = `${entity.fullName} (${entity.id})`;
    dto.age = this.calculateAge(entity.dateOfBirth);
    dto.isActive = entity.status === 'active';

    return dto;
  }

  private calculateAge(dateOfBirth: Date): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }
}
```

### 条件映射

根据条件决定映射逻辑：

```typescript
@Mapper()
export class UserMapper {
  @Mapping({ source: 'fullName', target: 'name' })
  toDto(entity: UserEntity): UserDto {
    const dto = transform(this, 'toDto', entity, UserDto);

    // 根据用户类型应用不同逻辑
    if (entity.type === 'premium') {
      dto.displayName = `⭐ ${dto.name}`;
      dto.features = ['advanced-search', 'priority-support'];
    } else {
      dto.displayName = dto.name;
      dto.features = ['basic-search'];
    }

    // 隐私保护
    if (!entity.profile?.isPublic) {
      dto.email = '***@***.com';
      dto.phone = '***-****-****';
    }

    return dto;
  }
}
```

## 复杂数据转换

### 数组和集合处理

```typescript
interface UserEntity {
  id: number;
  name: string;
  tags: string[];
  roles: Role[];
  permissions: Map<string, boolean>;
}

interface UserDto {
  id: number;
  name: string;
  tagList: string;
  roleNames: string[];
  canEdit: boolean;
  canDelete: boolean;
}

@Mapper()
export class UserMapper {
  toDto(entity: UserEntity): UserDto {
    const dto = transform(this, 'toDto', entity, UserDto);

    // 数组转字符串
    dto.tagList = entity.tags.join(', ');

    // 提取角色名称
    dto.roleNames = entity.roles.map(role => role.name);

    // Map 转具体权限
    dto.canEdit = entity.permissions.get('edit') || false;
    dto.canDelete = entity.permissions.get('delete') || false;

    return dto;
  }
}
```

### 嵌套对象转换

```typescript
interface AddressEntity {
  street: string;
  city: string;
  country: string;
  zipCode: string;
}

interface UserEntity {
  id: number;
  name: string;
  addresses: AddressEntity[];
}

interface UserDto {
  id: number;
  name: string;
  primaryAddress: string;
  allAddresses: string[];
}

@Mapper()
export class UserMapper {
  toDto(entity: UserEntity): UserDto {
    const dto = transform(this, 'toDto', entity, UserDto);

    // 格式化地址
    const formatAddress = (addr: AddressEntity) =>
      `${addr.street}, ${addr.city}, ${addr.country} ${addr.zipCode}`;

    // 主地址（第一个地址）
    dto.primaryAddress = entity.addresses.length > 0 ? formatAddress(entity.addresses[0]) : '';

    // 所有地址
    dto.allAddresses = entity.addresses.map(formatAddress);

    return dto;
  }
}
```

## 数据验证和清理

### 输入验证

```typescript
@Mapper()
export class UserMapper {
  toEntity(dto: UserDto): UserEntity {
    // 输入验证
    if (!dto.name || dto.name.trim().length === 0) {
      throw new Error('用户名不能为空');
    }

    if (!this.isValidEmail(dto.email)) {
      throw new Error('邮箱格式不正确');
    }

    const entity = transform(this, 'toEntity', dto, UserEntity);

    // 数据清理
    entity.name = dto.name.trim();
    entity.email = dto.email.toLowerCase();
    entity.createdAt = new Date();
    entity.updatedAt = new Date();

    return entity;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
```

### 数据清理和格式化

```typescript
@Mapper()
export class UserMapper {
  @Mapping({ source: 'fullName', target: 'name' })
  toDto(entity: UserEntity): UserDto {
    const dto = transform(this, 'toDto', entity, UserDto);

    // 字符串清理
    dto.name = this.cleanString(dto.name);
    dto.bio = this.cleanString(dto.bio);

    // 数字格式化
    dto.salary = this.formatCurrency(entity.salary);

    // 日期格式化
    dto.joinDate = this.formatDate(entity.joinDate);

    return dto;
  }

  private cleanString(str: string): string {
    return str?.trim().replace(/\s+/g, ' ') || '';
  }

  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
    }).format(amount);
  }

  private formatDate(date: Date): string {
    return new Intl.DateTimeFormat('zh-CN').format(date);
  }
}
```

## 异步转换

### 异步数据获取

```typescript
@Mapper()
export class UserMapper {
  async toDtoWithDetails(entity: UserEntity): Promise<UserDto> {
    // 基本映射
    const dto = transform(this, 'toDtoWithDetails', entity, UserDto);

    // 异步获取额外信息
    const [profile, stats, preferences] = await Promise.all([
      this.profileService.getProfile(entity.id),
      this.statsService.getUserStats(entity.id),
      this.preferencesService.getPreferences(entity.id),
    ]);

    // 合并异步数据
    dto.avatar = profile.avatar;
    dto.postCount = stats.postCount;
    dto.theme = preferences.theme;

    return dto;
  }

  constructor(
    private profileService: ProfileService,
    private statsService: StatsService,
    private preferencesService: PreferencesService
  ) {}
}
```

## 错误处理策略

### 优雅的错误处理

```typescript
@Mapper()
export class UserMapper {
  toDto(entity: UserEntity): UserDto {
    try {
      const dto = transform(this, 'toDto', entity, UserDto);

      // 安全的数据访问
      dto.profileImage = this.safeGetProfileImage(entity);
      dto.lastLoginTime = this.safeFormatDate(entity.lastLoginAt);

      return dto;
    } catch (error) {
      console.error('用户映射失败:', error);

      // 返回默认值或重新抛出错误
      return this.createDefaultDto(entity.id);
    }
  }

  private safeGetProfileImage(entity: UserEntity): string {
    try {
      return entity.profile?.images?.[0]?.url || '/default-avatar.png';
    } catch {
      return '/default-avatar.png';
    }
  }

  private safeFormatDate(date: Date | null): string {
    try {
      return date ? new Intl.DateTimeFormat('zh-CN').format(date) : '从未登录';
    } catch {
      return '日期格式错误';
    }
  }

  private createDefaultDto(id: number): UserDto {
    return {
      id,
      name: '未知用户',
      email: '',
      avatar: '/default-avatar.png',
      // ... 其他默认值
    };
  }
}
```

## 性能优化策略

### 缓存和记忆化

```typescript
@Mapper()
export class UserMapper {
  private formatCache = new Map<string, string>();

  toDto(entity: UserEntity): UserDto {
    const dto = transform(this, 'toDto', entity, UserDto);

    // 缓存昂贵的格式化操作
    dto.formattedAddress = this.getCachedFormattedAddress(entity.address);

    return dto;
  }

  private getCachedFormattedAddress(address: AddressEntity): string {
    const key = `${address.street}-${address.city}-${address.country}`;

    if (!this.formatCache.has(key)) {
      const formatted = this.expensiveAddressFormat(address);
      this.formatCache.set(key, formatted);
    }

    return this.formatCache.get(key)!;
  }

  private expensiveAddressFormat(address: AddressEntity): string {
    // 模拟昂贵的格式化操作
    return `${address.street}, ${address.city}, ${address.country}`;
  }
}
```

## 最佳实践

1. **保持方法简洁**: 将复杂逻辑拆分为私有方法
2. **错误处理**: 始终考虑边界情况和错误处理
3. **类型安全**: 充分利用 TypeScript 的类型系统
4. **性能考虑**: 对于大量数据转换，考虑缓存和优化
5. **测试覆盖**: 为自定义逻辑编写单元测试

## 下一步

- 探索 [NestJS 集成](../nestjs/getting-started) 中的依赖注入功能
- 了解 [抽象类支持](../nestjs/abstract-class) 的高级用法
- 查看 [API 文档](../../api/ts-mapper) 了解完整的接口定义
