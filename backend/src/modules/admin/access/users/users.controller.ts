import {
  ValidationPipe,
  ParseUUIDPipe,
  Controller,
  UseGuards,
  Param,
  Post,
  Body,
  Get,
  Put,
  Logger,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  PermissionsGuard,
  JwtAuthGuard,
  CurrentUser,
  Permissions,
  TOKEN_NAME,
} from '@auth';
import {
  ChangePasswordRequestDto,
  CreateUserRequestDto,
  UpdateUserRequestDto,
  UserResponseDto,
} from './dtos';
import {
  ApiGlobalResponse,
  ApiPaginatedResponse,
  PaginationParams,
} from '@common/decorators';
import { PaginationRequest } from '@common/interfaces';
import { PaginationResponseDto } from '@common/dtos';
import { UsersService } from './users.service';
import { UserEntity } from './user.entity';
import {
  UpdateUserBaseDto,
  UpdateUserInfoDto,
} from './dtos/update-user-info.dto';
import { CreateUserBaseRequestDto } from './dtos/create-user-request.dto';

@ApiTags('Users')
@ApiBearerAuth(TOKEN_NAME)
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller({
  path: 'access/users',
  version: '1',
})
export class UsersController {
  constructor(private usersService: UsersService) {}
  /**
   * 获取本人用户信息
   * @param user 当前用户
   * @returns 用户信息
   */
  @ApiOperation({ description: '获取本人用户信息' })
  @ApiGlobalResponse(UserResponseDto)
  @Get('/info')
  public getInfo(@CurrentUser() user: UserEntity): Promise<UserResponseDto> {
    return this.usersService.getUserById(user.id);
  }
  /**
   * 更新本人用户信息
   * @param user 当前用户
   * @param UserDto 用户数据
   * @returns 用户信息
   */
  @ApiOperation({ description: '更新本人用户信息' })
  @ApiGlobalResponse(UserResponseDto)
  @Put('/info')
  public updateInfo(
    @CurrentUser() user: UserEntity,
    @Body(ValidationPipe) UserDto: UpdateUserInfoDto,
  ): Promise<UserResponseDto> {
    return this.usersService.updateUser(user.id, UserDto);
  }
  /**
   * 用户管理分页
   * @param pagination 分页信息
   * @returns 用户管理分页
   */
  @ApiOperation({ description: '获得一个分页的用户列表' })
  @ApiPaginatedResponse(UserResponseDto)
  @ApiQuery({
    name: 'search',
    type: 'string',
    required: false,
    example: 'admin',
  })
  @Permissions(
    'admin.access.users.read',
    'admin.access.users.create',
    'admin.access.users.update',
  )
  @Get('/page')
  public getUsers(
    @PaginationParams() pagination: PaginationRequest,
  ): Promise<PaginationResponseDto<UserResponseDto>> {
    return this.usersService.getUsers(pagination);
  }
  /**
   * 通过ID获取用户信息
   * @param id 用户ID
   * @returns 用户信息
   */
  @ApiOperation({ description: '通过ID获取用户' })
  @ApiGlobalResponse(UserResponseDto)
  @Permissions(
    'admin.access.users.read',
    'admin.access.users.create',
    'admin.access.users.update',
  )
  @Get('/:id')
  public getUserById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<UserResponseDto> {
    Logger.log(id);
    return this.usersService.getUserById(id);
  }
  /**
   * 创建新用户
   * @param UserDto 新用户信息
   * @returns 新用户信息
   */
  @ApiOperation({ description: '创建新用户' })
  @ApiGlobalResponse(UserResponseDto)
  @ApiConflictResponse({ description: '用户名已经存在' })
  @ApiGlobalResponse(UserResponseDto)
  @Permissions('admin.access.users.create')
  @Post()
  public createUser(
    @Body(ValidationPipe) UserDto: CreateUserRequestDto,
  ): Promise<UserResponseDto> {
    return this.usersService.createUser(UserDto);
  }
  /**
   * 用户管理员创建用户
   * @param UserDto 简单用户信息
   * @returns 用户信息
   */
  @ApiOperation({ description: '创建新用户(简单)' })
  @ApiGlobalResponse(UserResponseDto)
  @ApiConflictResponse({ description: '用户名已经存在' })
  @ApiGlobalResponse(UserResponseDto)
  @Permissions('admin.access.users.create')
  @Post('/base')
  public createUserBase(
    @Body(ValidationPipe) UserDto: CreateUserBaseRequestDto,
  ): Promise<UserResponseDto> {
    return this.usersService.createUserBase(UserDto);
  }
  /**
   * 更新用户信息
   * @param id 用户ID
   * @param UserDto 用户更新信息
   * @returns 用户信息
   */
  @ApiOperation({ description: '按ID更新用户' })
  @ApiGlobalResponse(UserResponseDto)
  @ApiConflictResponse({ description: '用户名已经存在' })
  @Permissions('admin.access.users.update')
  @Put('/:id')
  public updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) UserDto: UpdateUserRequestDto,
  ): Promise<UserResponseDto> {
    return this.usersService.updateUser(id, UserDto);
  }
  /**
   * 管理员更新用户信息
   * @param id 用户ID
   * @param UserDto 用户更新基本信息
   * @returns 用户信息
   */
  @ApiOperation({ description: '按ID更新用户基本信息' })
  @ApiGlobalResponse(UserResponseDto)
  @ApiConflictResponse({ description: '用户名已经存在' })
  @Permissions('admin.access.users.update')
  @Put('/base/:id')
  public updateUserBaseInfo(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) UserDto: UpdateUserBaseDto,
  ): Promise<UserResponseDto> {
    return this.usersService.updateUser(id, UserDto);
  }
  /**
   * 更新用户密码
   * @param changePassword 更改的密码
   * @param user 当前用户
   * @returns 用户信息
   */
  @ApiOperation({ description: '更改用户密码' })
  @ApiGlobalResponse(UserResponseDto)
  @Post('/change/password')
  public changePassword(
    @Body(ValidationPipe) changePassword: ChangePasswordRequestDto,
    @CurrentUser() user: UserEntity,
  ): Promise<UserResponseDto> {
    return this.usersService.changePassword(changePassword, user.id);
  }
  /**
   * 拉黑用户
   * @param id 用户ID
   * @returns 用户信息
   */
  @ApiOperation({ description: '拉黑用户' })
  @ApiGlobalResponse(UserResponseDto)
  @Permissions('admin.access.users.update')
  @Post('/block/:id')
  public blockUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.blockUser(id);
  }
  /**
   * 拉白用户
   * @param id 用户ID
   * @returns 用户信息
   */
  @ApiOperation({ description: '拉白用户' })
  @ApiGlobalResponse(UserResponseDto)
  @Permissions('admin.access.users.update')
  @Post('/white/:id')
  public whiteUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.whiteUser(id);
  }
}
