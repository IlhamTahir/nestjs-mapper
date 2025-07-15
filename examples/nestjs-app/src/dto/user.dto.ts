import { ApiProperty } from '@nestjs/swagger';

/**
 * 返回给前端的用户数据传输对象
 */
export class UserDto {
  @ApiProperty({ description: '用户ID', example: 1 })
  id: number;

  @ApiProperty({ description: '用户名称', example: '张三' })
  name: string;

  @ApiProperty({ description: '年龄', example: 25 })
  age: number;

  @ApiProperty({ description: '邮箱', example: 'zhangsan@example.com' })
  email: string;

  @ApiProperty({ description: '是否激活', example: true })
  isActive: boolean;

  @ApiProperty({ description: '个人简介', example: '这是一个简介' })
  bio: string;

  @ApiProperty({ description: '头像URL', example: 'https://example.com/avatar.jpg' })
  avatar: string;

  constructor() {
    this.id = 0;
    this.name = '';
    this.age = 0;
    this.email = '';
    this.isActive = true;
    this.bio = '';
    this.avatar = '';
  }
}
