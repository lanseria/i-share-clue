import { JwtAuthGuard, PermissionsGuard, TOKEN_NAME } from '@modules/auth';
import {
  Body,
  Controller,
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
  ) {
    return this.projectService.createProject(projectDto);
  }
}
