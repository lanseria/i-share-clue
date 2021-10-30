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
  Get,
  Param,
  ParseFloatPipe,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateProjectRequestDto } from './dtos';
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
  @Post()
  public createProject(
    @Body(ValidationPipe) projectDto: CreateProjectRequestDto,
    @CurrentUser() user: UserEntity,
  ) {
    return this.projectService.createProject(projectDto, user);
  }

  @Get('/area/:nelat/:nelng/:swlat/:swlng')
  public searchAreaProjects(
    @Param('nelat', ParseFloatPipe) nelat: number,
    @Param('nelng', ParseFloatPipe) nelng: number,
    @Param('swlat', ParseFloatPipe) swlat: number,
    @Param('swlng', ParseFloatPipe) swlng: number,
  ) {
    this.projectService.searchAreaProjects([nelat, nelng, swlat, swlng]);
    return;
  }
}
