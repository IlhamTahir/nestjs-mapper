import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';
import { UserDto } from './dto/user.dto';
import { UserEntity } from './entities/user.entity';

/**
 * 应用控制器
 * 演示 Mapper 在实际 API 中的使用
 */
@ApiTags('用户管理')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * 获取单个用户
   */
  @Get('user')
  @ApiOperation({ summary: '获取单个用户信息' })
  @ApiResponse({ 
    status: 200, 
    description: '成功获取用户信息',
    type: UserDto 
  })
  getUser(): UserDto {
    return this.appService.getUser();
  }

  /**
   * 获取用户列表
   */
  @Get('users')
  @ApiOperation({ summary: '获取用户列表' })
  @ApiResponse({ 
    status: 200, 
    description: '成功获取用户列表',
    type: [UserDto] 
  })
  getUsers(): UserDto[] {
    return this.appService.getUsers();
  }

  /**
   * 创建用户
   */
  @Post('user')
  @ApiOperation({ summary: '创建新用户' })
  @ApiResponse({ 
    status: 201, 
    description: '成功创建用户',
    type: UserEntity 
  })
  createUser(@Body() userDto: UserDto): UserEntity {
    return this.appService.createUser(userDto);
  }

  /**
   * 健康检查
   */
  @Get()
  @ApiOperation({ summary: '健康检查' })
  @ApiResponse({ 
    status: 200, 
    description: '服务正常运行' 
  })
  getHello(): { message: string; timestamp: string } {
    return {
      message: 'NestJS Mapper Example is running!',
      timestamp: new Date().toISOString()
    };
  }
}
