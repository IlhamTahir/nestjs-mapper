import { Mapper, Mapping } from '@ilhamtahir/nestjs-mapper';
import { UserEntity } from '../entities/user.entity';
import { UserDto } from '../dto/user.dto';

/**
 * Mixed mode user mapper example
 * Demonstrates empty method body auto transform + custom method preservation
 */
@Mapper()
export class UserMixedMapper {
  /**
   * Empty method body: will automatically execute transform
   */
  @Mapping({ source: 'fullName', target: 'name' })
  @Mapping({ source: 'profile.bio', target: 'bio' })
  @Mapping({ source: 'profile.avatar', target: 'avatar' })
  toDto(_entity: UserEntity): UserDto {
    // Empty method body, system will automatically call transform
    return {} as UserDto;
  }

  /**
   * Custom method: preserves original logic, will not auto transform
   */
  toDtoWithCustomLogic(entity: UserEntity): UserDto {
    // Custom transformation logic
    const dto = new UserDto();
    dto.id = entity.id;
    dto.name = `[VIP] ${entity.fullName}`; // Add prefix
    dto.age = entity.age;
    dto.email = entity.email.toLowerCase(); // Convert to lowercase
    dto.bio = entity.profile?.bio || 'No bio available';
    dto.avatar = entity.profile?.avatar || 'default-avatar.png';

    return dto;
  }

  /**
   * Empty method body: batch conversion will also be handled automatically
   */
  toDtoList(entities: UserEntity[]): UserDto[] {
    // Empty method body, but since parameter is array, needs special handling
    // Here we manually implement batch conversion
    return entities.map(entity => this.toDto(entity));
  }

  /**
   * Custom method: conversion with business logic
   */
  toDtoWithStatus(entity: UserEntity): UserDto & { status: string } {
    const dto = this.toDto(entity);

    // Add status field
    const status = entity.isActive ? 'Active' : 'Inactive';

    return {
      ...dto,
      status,
    };
  }

  /**
   * Empty method body: reverse mapping
   */
  @Mapping({ source: 'name', target: 'fullName' })
  @Mapping({ source: 'bio', target: 'profile.bio' })
  @Mapping({ source: 'avatar', target: 'profile.avatar' })
  toEntity(_dto: UserDto): UserEntity {
    // Empty method body, will auto transform
    return {} as UserEntity;
  }
}
