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
import { UpdateUserInfoDto } from './dtos/update-user-info.dto';

@ApiTags('Users')
@ApiBearerAuth(TOKEN_NAME)
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller({
  path: 'access/users',
  version: '1',
})
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ description: '获取本人用户信息' })
  @ApiGlobalResponse(UserResponseDto)
  @Get('/info')
  public getInfo(@CurrentUser() user: UserEntity): Promise<UserResponseDto> {
    return this.usersService.getUserById(user.id);
  }

  @ApiOperation({ description: '更新本人用户信息' })
  @ApiGlobalResponse(UserResponseDto)
  @Put('/info')
  public updateInfo(
    @CurrentUser() user: UserEntity,
    @Body(ValidationPipe) UserDto: UpdateUserInfoDto,
  ): Promise<UserResponseDto> {
    return this.usersService.updateUser(user.id, UserDto);
  }

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
  @Get()
  public getUsers(
    @PaginationParams() pagination: PaginationRequest,
  ): Promise<PaginationResponseDto<UserResponseDto>> {
    return this.usersService.getUsers(pagination);
  }

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

  @ApiOperation({ description: '创建新用户' })
  @ApiGlobalResponse(UserResponseDto)
  @ApiConflictResponse({ description: '用户已经存在' })
  @ApiGlobalResponse(UserResponseDto)
  @Permissions('admin.access.users.create')
  @Post()
  public createUser(
    @Body(ValidationPipe) UserDto: CreateUserRequestDto,
  ): Promise<UserResponseDto> {
    return this.usersService.createUser(UserDto);
  }

  @ApiOperation({ description: '按ID更新用户' })
  @ApiGlobalResponse(UserResponseDto)
  @ApiConflictResponse({ description: '用户已经存在' })
  @Permissions('admin.access.users.update')
  @Put('/:id')
  public updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) UserDto: UpdateUserRequestDto,
  ): Promise<UserResponseDto> {
    return this.usersService.updateUser(id, UserDto);
  }

  @ApiOperation({ description: '更改用户密码' })
  @ApiGlobalResponse(UserResponseDto)
  @Post('/change/password')
  public changePassword(
    @Body(ValidationPipe) changePassword: ChangePasswordRequestDto,
    @CurrentUser() user: UserEntity,
  ): Promise<UserResponseDto> {
    Logger.log(user);
    return this.usersService.changePassword(changePassword, user.id);
  }
}
