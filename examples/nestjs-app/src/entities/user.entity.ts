/**
 * 模拟数据库实体
 */
export class UserEntity {
  id: number;
  fullName: string;
  age: number;
  email: string;
  isActive: boolean;
  profile: {
    bio: string;
    avatar: string;
  };
  createdAt: Date;
  updatedAt: Date;

  constructor() {
    this.id = 0;
    this.fullName = '';
    this.age = 0;
    this.email = '';
    this.isActive = true;
    this.profile = {
      bio: '',
      avatar: '',
    };
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
