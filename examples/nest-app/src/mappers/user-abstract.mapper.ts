import { Mapper, Mapping } from '@ilhamtahir/nest-mapper';
import { UserEntity } from '../entities/user.entity';
import { UserDto } from '../dto/user.dto';

/**
 * Abstract user mapper example
 * Demonstrates using abstract class and auto transform functionality
 *
 * Note: Due to TypeScript limitations, decorators cannot be used directly on abstract methods
 * We use empty method bodies to achieve the same effect
 */
@Mapper()
export abstract class UserAbstractMapper {
  /**
   * Empty method body: Convert UserEntity to UserDto
   * System will automatically generate implementation, no need to write method body
   */
  @Mapping({ source: 'fullName', target: 'name' })
  @Mapping({ source: 'profile.bio', target: 'bio' })
  @Mapping({ source: 'profile.avatar', target: 'avatar' })
  toDto(_entity: UserEntity): UserDto {
    // Empty method body, system will automatically call transform
    return {} as UserDto;
  }

  /**
   * Empty method body: Batch conversion
   */
  toDtoList(entities: UserEntity[]): UserDto[] {
    // Manually implement batch conversion
    return entities.map(entity => this.toDto(entity));
  }

  /**
   * Empty method body: Reverse mapping
   */
  @Mapping({ source: 'name', target: 'fullName' })
  @Mapping({ source: 'bio', target: 'profile.bio' })
  @Mapping({ source: 'avatar', target: 'profile.avatar' })
  toEntity(_dto: UserDto): UserEntity {
    // Empty method body, system will automatically call transform
    return {} as UserEntity;
  }
}
