import { Injectable } from '@nestjs/common';
import { UserMapper } from './mappers/user.mapper';
import { UserAbstractMapper } from './mappers/user-abstract.mapper';
import { UserMixedMapper } from './mappers/user-mixed.mapper';
import { UserEntity } from './entities/user.entity';
import { UserDto } from './dto/user.dto';

/**
 * 应用服务
 * 演示如何注入和使用 UserMapper
 */
@Injectable()
export class AppService {
  constructor(
    private readonly userMapper: UserMapper,
    private readonly userAbstractMapper: UserAbstractMapper,
    private readonly userMixedMapper: UserMixedMapper
  ) {}

  /**
   * 获取单个用户
   */
  getUser(): UserDto {
    // 模拟从数据库获取的实体数据
    const userEntity = new UserEntity();
    userEntity.id = 1;
    userEntity.fullName = '张三';
    userEntity.age = 25;
    userEntity.email = 'zhangsan@example.com';
    userEntity.isActive = true;
    userEntity.profile = {
      bio: '这是张三的个人简介',
      avatar: 'https://example.com/avatar/zhangsan.jpg',
    };
    userEntity.createdAt = new Date('2023-01-01');
    userEntity.updatedAt = new Date();

    // 使用 mapper 转换为 DTO
    return this.userMapper.toDto(userEntity);
  }

  /**
   * 获取用户列表
   */
  getUsers(): UserDto[] {
    // 模拟从数据库获取的实体数据列表
    const userEntities: UserEntity[] = [
      {
        id: 1,
        fullName: '张三',
        age: 25,
        email: 'zhangsan@example.com',
        isActive: true,
        profile: {
          bio: '这是张三的个人简介',
          avatar: 'https://example.com/avatar/zhangsan.jpg',
        },
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date(),
      },
      {
        id: 2,
        fullName: '李四',
        age: 30,
        email: 'lisi@example.com',
        isActive: false,
        profile: {
          bio: '这是李四的个人简介',
          avatar: 'https://example.com/avatar/lisi.jpg',
        },
        createdAt: new Date('2023-02-01'),
        updatedAt: new Date(),
      },
      {
        id: 3,
        fullName: '王五',
        age: 28,
        email: 'wangwu@example.com',
        isActive: true,
        profile: {
          bio: '这是王五的个人简介',
          avatar: 'https://example.com/avatar/wangwu.jpg',
        },
        createdAt: new Date('2023-03-01'),
        updatedAt: new Date(),
      },
    ];

    // 使用 mapper 批量转换为 DTO
    return this.userMapper.toDtoList(userEntities);
  }

  /**
   * Create user (demonstrates reverse mapping)
   */
  createUser(userDto: UserDto): UserEntity {
    // Use mapper to convert DTO to Entity
    const userEntity = this.userMapper.toEntity(userDto);

    // Simulate saving to database logic
    console.log('Saving user to database:', userEntity);

    return userEntity;
  }

  /**
   * Test Abstract Mapper (auto transform)
   */
  getUserWithAbstractMapper(): UserDto {
    const userEntity = this.createMockUserEntity();

    // Use abstract mapper, method will automatically execute transform
    return this.userAbstractMapper.toDto(userEntity);
  }

  /**
   * Test Mixed Mapper (empty method body + custom methods)
   */
  getUserWithMixedMapper(): {
    autoTransform: UserDto;
    customLogic: UserDto;
    withStatus: UserDto & { status: string };
  } {
    const userEntity = this.createMockUserEntity();

    return {
      // Empty method body, auto transform
      autoTransform: this.userMixedMapper.toDto(userEntity),
      // Custom logic
      customLogic: this.userMixedMapper.toDtoWithCustomLogic(userEntity),
      // Custom conversion with status
      withStatus: this.userMixedMapper.toDtoWithStatus(userEntity),
    };
  }

  /**
   * Create mock user entity
   */
  private createMockUserEntity(): UserEntity {
    const userEntity = new UserEntity();
    userEntity.id = 1;
    userEntity.fullName = 'John Doe';
    userEntity.age = 25;
    userEntity.email = 'john.doe@example.com';
    userEntity.isActive = true;
    userEntity.profile = {
      bio: "This is John Doe's personal bio",
      avatar: 'https://example.com/avatar/johndoe.jpg',
    };
    userEntity.createdAt = new Date('2023-01-01');
    userEntity.updatedAt = new Date();

    return userEntity;
  }
}
