import { Mapper, Mapping, transform } from '@ilhamtahir/nestjs-mapper';
import { UserEntity } from '../entities/user.entity';
import { UserDto } from '../dto/user.dto';

/**
 * 用户映射器
 * 演示 @Mapper 和 @Mapping 装饰器的使用
 */
@Mapper()
export class UserMapper {
  /**
   * 将 UserEntity 转换为 UserDto
   * 使用 @Mapping 装饰器进行显式字段映射
   * 其他字段名相同的会自动映射
   */
  @Mapping({ source: 'fullName', target: 'name' })
  @Mapping({ source: 'profile.bio', target: 'bio' })
  @Mapping({ source: 'profile.avatar', target: 'avatar' })
  toDto(entity: UserEntity): UserDto {
    return transform(this, 'toDto', entity, UserDto);
  }

  /**
   * 批量转换
   */
  toDtoList(entities: UserEntity[]): UserDto[] {
    return entities.map(entity => this.toDto(entity));
  }

  /**
   * 将 UserDto 转换回 UserEntity（演示反向映射）
   */
  @Mapping({ source: 'name', target: 'fullName' })
  @Mapping({ source: 'bio', target: 'profile.bio' })
  @Mapping({ source: 'avatar', target: 'profile.avatar' })
  toEntity(dto: UserDto): UserEntity {
    const entity = transform(this, 'toEntity', dto, UserEntity);
    // 设置一些默认值
    entity.createdAt = new Date();
    entity.updatedAt = new Date();
    return entity;
  }
}
