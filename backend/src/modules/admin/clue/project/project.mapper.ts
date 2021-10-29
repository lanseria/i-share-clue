import { UserMapper } from '@modules/admin/access/users/users.mapper';
import { Point } from 'geojson';
import { gcj02towgs84, wgs84togcj02 } from 'src/helpers/convert';
import { CreateProjectRequestDto } from './dtos';
import { ProjectLocation } from './dtos/location';
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
    const pointObject: Point = {
      type: 'Point',
      coordinates: gcj02towgs84(dto.location.lng, dto.location.lat),
    };
    entity.location = pointObject;
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
    const location = wgs84togcj02(
      entity.location.coordinates[0],
      entity.location.coordinates[1],
    );
    dto.location = new ProjectLocation({
      lng: location[0],
      lat: location[1],
    });
    return dto;
  }
}