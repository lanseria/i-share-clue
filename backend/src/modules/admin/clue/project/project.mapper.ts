import { UserMapper } from '@modules/admin/access/users/users.mapper';
import { Logger } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { Point } from 'geojson';
import { gcj02towgs84, wgs84togcj02 } from 'src/helpers/convert';
import { CreateProjectRequestDto } from './dtos';
import { ProjectLocation } from './dtos/location';
import { ProjectJsonDto } from './dtos/project-json.dto';
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

  public static toJsonDto(entity: ProjectEntity) {
    const dto = new ProjectJsonDto();
    dto.category = entity.category;
    dto.desc = entity.desc;
    const coordinates = wgs84togcj02(
      entity.location.coordinates[0],
      entity.location.coordinates[1],
    ) as [number, number];
    dto.location = new ProjectLocation({
      lng: coordinates[0],
      lat: coordinates[1],
    });
    dto.name = entity.name;
    dto.region = entity.region;
    dto.website = entity.website;
    dto.updatedAt = dayjs(entity.updatedAt).unix();
    dto.createdAt = dayjs(entity.createdAt).unix();
    return dto;
  }

  public static toDto(entity: ProjectEntity) {
    const dto = new ProjectResponseDto();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.website = entity.website;
    dto.desc = entity.desc;
    dto.category = entity.category;
    dto.region = entity.region;
    dto.creator = UserMapper.toDto(entity.creator);
    dto.createdAt = dayjs(entity.createdAt).unix();
    dto.updatedAt = dayjs(entity.updatedAt).unix();
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
