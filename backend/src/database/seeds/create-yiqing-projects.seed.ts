import { Factory, Seeder } from 'typeorm-seeding';
import { Connection, In } from 'typeorm';
import * as _ from 'lodash';
import { ProjectEntity } from '@modules/admin/clue/project/project.entity';
import { Point } from 'geojson';
import { UserEntity } from '@modules/admin/access/users/user.entity';
import { UserStatus } from '@modules/admin/access/users/user-status.enum';
const projects: ProjectJsonVo[] = require('../sql/projects.json');
interface ProjectJsonVo {
  created_at: string;
  updated_at: string;
  id: string;
  website: string;
  desc: string;
  category: string;
  region: string;
  name: string;
  location: string;
  creatorId: string;
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
      projects.map((m) => {
        return connection
          .query(`SELECT ST_AsText('${m.location}');`)
          .then((mm) => {
            const coordinates = mm[0].st_astext
              .match(/^POINT\(([\d+\.\d+]+ [\d+\.\d+]+)\)$/)[1]
              .split(' ');
            const entity = new ProjectEntity();
            entity.name = m.name;
            entity.website = m.website ?? 'http://ivhik.cn';
            entity.desc = m.desc ?? '描述疫情';
            entity.category = m.category ?? '1';
            entity.region = m.region ?? '1';
            entity.creator = users[0];
            const pointObject: Point = {
              type: 'Point',
              coordinates: coordinates,
            };
            entity.location = pointObject;
            return entity;
          });
      }),
    );
    console.log(projectEntities);
    await connection.manager.save(projectEntities);
  }
}
