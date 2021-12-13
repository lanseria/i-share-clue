import { PaginationResponseDto } from '@common/dtos';
import { PaginationRequest } from '@common/interfaces';
import { Pagination } from '@helpers';
import { UserEntity } from '@modules/admin/access/users/user.entity';
import { UsersRepository } from '@modules/admin/access/users/users.repository';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TimeoutError } from 'rxjs';
import { CreateProjectRequestDto } from './dtos';
import { ProjectResponseDto } from './dtos/project-response.dto';
import { ProjectMapper } from './project.mapper';
import { ProjectRepository } from './project.repository';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
    @InjectRepository(ProjectRepository)
    private projectRepository: ProjectRepository,
  ) {}

  /**
   * 导出所有项目为Excel
   * @returns
   */
  public async exportProject() {
    const projectEntities = await this.projectRepository.find();
    return projectEntities.map(ProjectMapper.toJsonDto);
  }
  /**
   * 删除项目
   * @param ids
   * @returns
   */
  public async deleteProject(ids: string[]) {
    try {
      await this.projectRepository.delete(ids);
      return true;
    } catch (error) {
      if (error instanceof TimeoutError) {
        throw new RequestTimeoutException();
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
  /**
   * 获取项目分页
   * @param pagination 分页
   * @returns
   */
  public async getProjects(
    pagination: PaginationRequest,
  ): Promise<PaginationResponseDto<ProjectResponseDto>> {
    try {
      const [projectEntities, totolProjects] =
        await this.projectRepository.getProjectsAndCount(pagination);
      const ProjectDtos = await Promise.all(
        projectEntities.map(ProjectMapper.toDto),
      );
      return Pagination.of(pagination, totolProjects, ProjectDtos);
    } catch (error) {
      Logger.error(error);
      if (error instanceof NotFoundException) {
        throw new NotFoundException();
      }
      if (error instanceof TimeoutError) {
        throw new RequestTimeoutException();
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
  /**
   * 创建项目
   * @param projectDto 项目Dto
   * @param user 用户
   * @returns
   */
  public async createProject(
    projectDto: CreateProjectRequestDto,
    user: UserEntity,
  ) {
    try {
      let projectEntity = ProjectMapper.toCreateEntity(projectDto);
      const userEntity = await this.usersRepository.findOne(user.id);
      projectEntity.creator = userEntity;
      projectEntity = await this.projectRepository.save(projectEntity);
      return ProjectMapper.toDto(projectEntity);
    } catch (error) {
      if (error instanceof TimeoutError) {
        throw new RequestTimeoutException();
      } else {
        Logger.warn(error);
        throw new InternalServerErrorException();
      }
    }
  }
  /**
   * 获取范围内项目
   * @param bounds 范围经纬度
   * @returns
   */
  public async searchAreaProjects(bounds: [number, number, number, number]) {
    try {
      const [projectEntities, totalProjects] =
        await this.projectRepository.searchArea(bounds);
      // console.log(projectEntities, totalProjects);
      return projectEntities.map((m) => {
        return ProjectMapper.toDto(m);
      });
    } catch (error) {
      console.warn(error);
      throw new InternalServerErrorException();
    }
  }
}
