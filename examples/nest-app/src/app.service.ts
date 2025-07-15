import { Injectable } from '@nestjs/common';
import { UserMapper } from './mappers/user.mapper';
import { UserEntity } from './entities/user.entity';
import { UserDto } from './dto/user.dto';

/**
 * 应用服务
 * 演示如何注入和使用 UserMapper
 */
@Injectable()
export class AppService {
  constructor(private readonly userMapper: UserMapper) {}

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
      avatar: 'https://example.com/avatar/zhangsan.jpg'
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
          avatar: 'https://example.com/avatar/zhangsan.jpg'
        },
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date()
      },
      {
        id: 2,
        fullName: '李四',
        age: 30,
        email: 'lisi@example.com',
        isActive: false,
        profile: {
          bio: '这是李四的个人简介',
          avatar: 'https://example.com/avatar/lisi.jpg'
        },
        createdAt: new Date('2023-02-01'),
        updatedAt: new Date()
      },
      {
        id: 3,
        fullName: '王五',
        age: 28,
        email: 'wangwu@example.com',
        isActive: true,
        profile: {
          bio: '这是王五的个人简介',
          avatar: 'https://example.com/avatar/wangwu.jpg'
        },
        createdAt: new Date('2023-03-01'),
        updatedAt: new Date()
      }
    ];

    // 使用 mapper 批量转换为 DTO
    return this.userMapper.toDtoList(userEntities);
  }

  /**
   * 创建用户（演示反向映射）
   */
  createUser(userDto: UserDto): UserEntity {
    // 使用 mapper 将 DTO 转换为 Entity
    const userEntity = this.userMapper.toEntity(userDto);
    
    // 模拟保存到数据库的逻辑
    console.log('保存用户到数据库:', userEntity);
    
    return userEntity;
  }
}
