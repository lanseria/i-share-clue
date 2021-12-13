import { ApiPaginatedResponse, PaginationParams } from '@common/decorators';
import { PaginationResponseDto } from '@common/dtos';
import { PaginationRequest } from '@common/interfaces';
import { UserEntity } from '@modules/admin/access/users/user.entity';
import {
  CurrentUser,
  JwtAuthGuard,
  PermissionsGuard,
  TOKEN_NAME,
} from '@modules/auth';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseFloatPipe,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateProjectRequestDto } from './dtos';
import { ProjectResponseDto } from './dtos/project-response.dto';
import { ProjectService } from './project.service';

@ApiTags('Project')
@ApiBearerAuth(TOKEN_NAME)
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller({
  path: 'clue/project',
  version: '1',
})
export class ProjectController {
  constructor(private projectService: ProjectService) {}
  /**
   * 导出所有项目
   * @returns
   */
  @ApiOperation({ description: '导出所有项目' })
  @Post('/export')
  public exportProject() {
    return this.projectService.exportProject();
  }
  /**
   * 删除项目
   * @param ids
   * @returns
   */
  @ApiOperation({ description: '删除项目' })
  @Delete()
  public deleteProject(@Body() ids: string[]) {
    return this.projectService.deleteProject(ids);
  }
  /**
   * 项目管理分页
   * @param pagination 分页信息
   * @returns 项目管理分页
   */
  @ApiOperation({ description: '获得一个分页的项目列表' })
  @ApiPaginatedResponse(ProjectResponseDto)
  @Get('/page')
  public getUsers(
    @PaginationParams() pagination: PaginationRequest,
  ): Promise<PaginationResponseDto<ProjectResponseDto>> {
    return this.projectService.getProjects(pagination);
  }
  /**
   * 项目新增
   * @param projectDto
   * @param user
   * @returns
   */
  @Post()
  public createProject(
    @Body(ValidationPipe) projectDto: CreateProjectRequestDto,
    @CurrentUser() user: UserEntity,
  ) {
    return this.projectService.createProject(projectDto, user);
  }
  /**
   * 范围查询
   * @param nelat 东北经度
   * @param nelng 东北维度
   * @param swlat 西南经度
   * @param swlng 西南维度
   * @returns
   */
  @Get('/area/:nelat/:nelng/:swlat/:swlng')
  public searchAreaProjects(
    @Param('nelat', ParseFloatPipe) nelat: number,
    @Param('nelng', ParseFloatPipe) nelng: number,
    @Param('swlat', ParseFloatPipe) swlat: number,
    @Param('swlng', ParseFloatPipe) swlng: number,
  ): Promise<ProjectResponseDto[]> {
    return this.projectService.searchAreaProjects([nelat, nelng, swlat, swlng]);
  }
}
