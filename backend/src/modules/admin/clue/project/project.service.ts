import { UserEntity } from '@modules/admin/access/users/user.entity';
import { UsersRepository } from '@modules/admin/access/users/users.repository';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TimeoutError } from 'rxjs';
import { CreateProjectRequestDto } from './dtos';
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

  public async createProject(
    projectDto: CreateProjectRequestDto,
    user: UserEntity,
  ) {
    try {
      let projectEntity = ProjectMapper.toCreateEntity(projectDto);
      const userEntity = await this.usersRepository.findOne(user.id);
      projectEntity.createor = userEntity;
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

  public async searchAreaProjects(bounds: [number, number, number, number]) {
    try {
      const [projectEntities, totalProjects] =
        await this.projectRepository.searchArea(bounds);
      console.log(projectEntities, totalProjects);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
