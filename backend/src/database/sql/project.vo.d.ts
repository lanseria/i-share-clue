import { ProjectLocation } from '@modules/admin/clue/project/dtos/location';

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
export { ProjectJsonVo };
