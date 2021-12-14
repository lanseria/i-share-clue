import { wgs84togcj02 } from './convert';
import * as fs from 'fs';
import { ProjectJsonVo } from '../database/sql/project.vo';
const projects: ProjectJsonVo[] = require('../database/sql/1639412646-all-clue-projects.json');

const ps = projects.map((m) => {
  const location = m.location as any;
  const loc = wgs84togcj02(location.lng, location.lat);
  return {
    ...m,
    location: {
      lat: loc[1],
      lng: loc[0],
    },
  };
});

fs.writeFileSync(
  './src/database/sql/wx-all-clue-projects.json',
  JSON.stringify(ps, null, 2),
);
