import { UserMapper } from '@modules/admin/access/users/users.mapper';
import { CreateProjectRequestDto } from './dtos';
import { ProjectResponseDto } from './dtos/project-response.dto';
import { ProjectEntity } from './project.entity';

export class ProjectMapper {
  public static toCreateEntity(dto: CreateProjectRequestDto): ProjectEntity {
    const entity = new ProjectEntity();
    entity.name = dto.name;
    entity.website = dto.website;
    entity.desc = dto.desc;
    entity.category = dto.category;
    entity.region = dto.region;
    return entity;
  }

  public static toDto(entity: ProjectEntity) {
    const dto = new ProjectResponseDto();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.website = entity.website;
    dto.desc = entity.desc;
    dto.category = entity.category;
    dto.region = entity.region;
    dto.creator = UserMapper.toDto(entity.createor);
    return dto;
  }
}
