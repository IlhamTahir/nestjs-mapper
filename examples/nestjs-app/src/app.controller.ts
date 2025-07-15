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
  @ApiOperation({ summary: 'Get single user information' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved user information',
    type: UserDto,
  })
  getUser(): UserDto {
    return this.appService.getUser();
  }

  /**
   * 获取用户列表
   */
  @Get('users')
  @ApiOperation({ summary: 'Get user list' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved user list',
    type: [UserDto],
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
    type: UserEntity,
  })
  createUser(@Body() userDto: UserDto): UserEntity {
    return this.appService.createUser(userDto);
  }

  /**
   * 测试 Abstract Mapper
   */
  @Get('user/abstract')
  @ApiOperation({ summary: '测试 Abstract Mapper 自动 transform' })
  @ApiResponse({
    status: 200,
    description: '使用 abstract class 的自动映射结果',
    type: UserDto,
  })
  getUserWithAbstractMapper(): UserDto {
    return this.appService.getUserWithAbstractMapper();
  }

  /**
   * 测试 Mixed Mapper
   */
  @Get('user/mixed')
  @ApiOperation({ summary: '测试 Mixed Mapper（空方法体 + 自定义方法）' })
  @ApiResponse({
    status: 200,
    description: '展示空方法体自动 transform 和自定义方法的区别',
  })
  getUserWithMixedMapper() {
    return this.appService.getUserWithMixedMapper();
  }

  /**
   * 健康检查
   */
  @Get()
  @ApiOperation({ summary: '健康检查' })
  @ApiResponse({
    status: 200,
    description: '服务正常运行',
  })
  getHello(): { message: string; timestamp: string } {
    return {
      message: 'NestJS Mapper Example is running! 🚀 支持 Abstract Class + Proxy 自动映射',
      timestamp: new Date().toISOString(),
    };
  }
}
