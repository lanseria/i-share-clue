import { Polygon } from 'geojson';
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
          [bounds[1], bounds[0]],
          [bounds[3], bounds[0]],
          [bounds[3], bounds[2]],
          [bounds[1], bounds[2]],
          [bounds[1], bounds[0]],
        ],
      ],
    };
    const query = this.createQueryBuilder('p')
      .where(
        `
    ST_DWithin(location, ST_GeomFromGeoJSON(:area), 4326)`,
      )
      .setParameters({
        // 字符串化 GeoJSON
        area: JSON.stringify(area),
      });
    return query.getManyAndCount();
  }
}
