import { Logger } from '@nestjs/common';
import { Polygon } from 'geojson';
import { gcj02towgs84 } from 'src/helpers/convert';
import { EntityRepository, Repository } from 'typeorm';
import { ProjectEntity } from './project.entity';

// '{"type":"Polygon","coordinates":[[
// [121.9207763671875,29.919827938891753],
// [122.35404968261719,29.919827938891753],
// [122.35404968261719,30.194992169502903],
// [121.9207763671875,30.194992169502903],
// [121.9207763671875,29.919827938891753]
// ]]}'
@EntityRepository(ProjectEntity)
export class ProjectRepository extends Repository<ProjectEntity> {
  public searchArea(bounds: [number, number, number, number]) {
    const area: Polygon = {
      type: 'Polygon',
      coordinates: [
        [
          gcj02towgs84(bounds[1], bounds[0]),
          gcj02towgs84(bounds[3], bounds[0]),
          gcj02towgs84(bounds[3], bounds[2]),
          gcj02towgs84(bounds[1], bounds[2]),
          gcj02towgs84(bounds[1], bounds[0]),
        ],
      ],
    };
    Logger.warn(JSON.stringify(area));
    const query = this.createQueryBuilder('p')
      .leftJoinAndSelect('p.creator', 'u')
      .where(`ST_DWithin(location, ST_GeomFromGeoJSON(:area), 0)`)
      .setParameters({
        // 字符串化 GeoJSON
        area: JSON.stringify(area),
      });
    return query.getManyAndCount();
  }
}
