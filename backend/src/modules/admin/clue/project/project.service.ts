import { UsersRepository } from '@modules/admin/access/users/users.repository';
import {
  Injectable,
  InternalServerErrorException,
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
  public async createProject(projectDto: CreateProjectRequestDto) {
    try {
      let projectEntity = ProjectMapper.toCreateEntity(projectDto);
      const userEntity = await this.usersRepository.findOne(
        projectDto.creatorId,
      );
      projectEntity.createor = userEntity;
      projectEntity = await this.projectRepository.save(projectEntity);
      return ProjectMapper.toDto(projectEntity);
    } catch (error) {
      if (error instanceof TimeoutError) {
        throw new RequestTimeoutException();
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
