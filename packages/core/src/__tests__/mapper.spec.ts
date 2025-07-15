import { Mapper, Mapping, transform } from '../index';

// Test entities and DTOs
class UserEntity {
  id: number;
  fullName: string;
  email: string;
  profile: {
    bio: string;
    avatar: string;
  };

  constructor(data: Partial<UserEntity> = {}) {
    this.id = data.id || 0;
    this.fullName = data.fullName || '';
    this.email = data.email || '';
    this.profile = data.profile || { bio: '', avatar: '' };
  }
}

class UserDto {
  id: number;
  name: string;
  email: string;
  bio: string;
  avatar: string;

  constructor() {
    this.id = 0;
    this.name = '';
    this.email = '';
    this.bio = '';
    this.avatar = '';
  }
}

@Mapper()
class UserMapper {
  @Mapping({ source: 'fullName', target: 'name' })
  @Mapping({ source: 'profile.bio', target: 'bio' })
  @Mapping({ source: 'profile.avatar', target: 'avatar' })
  toDto(entity: UserEntity): UserDto {
    return transform(this, 'toDto', entity, UserDto);
  }

  @Mapping({ source: 'name', target: 'fullName' })
  @Mapping({ source: 'bio', target: 'profile.bio' })
  @Mapping({ source: 'avatar', target: 'profile.avatar' })
  toEntity(dto: UserDto): UserEntity {
    return transform(this, 'toEntity', dto, UserEntity);
  }
}

describe('Mapper', () => {
  let mapper: UserMapper;

  beforeEach(() => {
    mapper = new UserMapper();
  });

  describe('toDto', () => {
    it('should map basic fields correctly', () => {
      const entity = new UserEntity({
        id: 1,
        fullName: 'John Doe',
        email: 'john@example.com',
        profile: {
          bio: 'Software Developer',
          avatar: 'avatar.jpg',
        },
      });

      const dto = mapper.toDto(entity);

      expect(dto.id).toBe(1);
      expect(dto.name).toBe('John Doe');
      expect(dto.email).toBe('john@example.com');
      expect(dto.bio).toBe('Software Developer');
      expect(dto.avatar).toBe('avatar.jpg');
    });

    it('should handle null nested properties gracefully', () => {
      const entity = new UserEntity({
        id: 1,
        fullName: 'John Doe',
        email: 'john@example.com',
        profile: null as any,
      });

      const dto = mapper.toDto(entity);

      expect(dto.id).toBe(1);
      expect(dto.name).toBe('John Doe');
      expect(dto.email).toBe('john@example.com');
      expect(dto.bio || undefined).toBeUndefined();
      expect(dto.avatar || undefined).toBeUndefined();
    });
  });

  describe('toEntity', () => {
    it('should map DTO to entity correctly', () => {
      const dto = new UserDto();
      dto.id = 1;
      dto.name = 'John Doe';
      dto.email = 'john@example.com';
      dto.bio = 'Software Developer';
      dto.avatar = 'avatar.jpg';

      const entity = mapper.toEntity(dto);

      expect(entity.id).toBe(1);
      expect(entity.fullName).toBe('John Doe');
      expect(entity.email).toBe('john@example.com');
      expect(entity.profile.bio).toBe('Software Developer');
      expect(entity.profile.avatar).toBe('avatar.jpg');
    });
  });

  describe('automatic field mapping', () => {
    it('should automatically map fields with same names', () => {
      const entity = new UserEntity({
        id: 42,
        email: 'test@example.com',
      });

      const dto = mapper.toDto(entity);

      expect(dto.id).toBe(42);
      expect(dto.email).toBe('test@example.com');
    });
  });
});
