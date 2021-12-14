import { Factory, Seeder } from 'typeorm-seeding';
import { Connection, In } from 'typeorm';
import * as _ from 'lodash';
import { ProjectEntity } from '@modules/admin/clue/project/project.entity';
import { Point } from 'geojson';
import { UserEntity } from '@modules/admin/access/users/user.entity';
import { UserStatus } from '@modules/admin/access/users/user-status.enum';
import * as dayjs from 'dayjs';
import { ProjectLocation } from '@modules/admin/clue/project/dtos/location';
const projects: ProjectJsonVo[] = require('../sql/1639412646-all-clue-projects.json');
interface ProjectJsonVo {
  createdAt: string;
  updatedAt: string;
  website: string;
  desc: string;
  category: string;
  region: string;
  name: string;
  location: string | ProjectLocation;
}

function genProject(coordinates, project, users) {
  const entity = new ProjectEntity();
  entity.name = project.name;
  entity.website = project.website ?? 'http://ivhik.cn';
  entity.desc = project.desc ?? '描述疫情';
  entity.category = project.category ?? '1';
  entity.region = project.region ?? '1';
  entity.createdAt = dayjs.unix(project.createdAt).toDate();
  entity.updatedAt = dayjs.unix(project.updatedAt).toDate();
  entity.creator = users[0];
  const pointObject: Point = {
    type: 'Point',
    coordinates: coordinates,
  };
  entity.location = pointObject;
  return entity;
}
export default class CreateYiqingProjectsSeed implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    // find users
    const users = await connection.manager.find(UserEntity, {
      where: {
        status: UserStatus.Active,
      },
    });
    if (!users.length) {
      throw new Error('NoUser!');
    }
    const projectEntities = await Promise.all(
      projects.map((project) => {
        if (typeof project.location === 'string') {
          return connection
            .query(`SELECT ST_AsText('${project.location}');`)
            .then((pLocStr) => {
              const coordinates = pLocStr[0].st_astext
                .match(/^POINT\(([\d+\.\d+]+ [\d+\.\d+]+)\)$/)[1]
                .split(' ');
              return genProject(coordinates, project, users);
            });
        } else if (typeof project.location === 'object') {
          const coordinates = [project.location.lng, project.location.lat];
          return genProject(coordinates, project, users);
        } else {
          throw new Error('no location!');
        }
      }),
    );
    await connection.manager.save(projectEntities);
  }
}
