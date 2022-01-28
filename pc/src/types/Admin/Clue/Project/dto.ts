import dayjs from 'dayjs';
import { CommonDTO } from '/@/types/Common/dto';

export class ProjectLocation {
  lat: number;
  lng: number;

  constructor(that: ProjectLocation) {
    this.lat = that.lat;
    this.lng = that.lng;
  }
}

class CreateProjectFormDTO extends CommonDTO {
  name = '';
  desc = '';
  happenedAt = dayjs().valueOf();
  category = '1';
  region = '1';
  location: ProjectLocation | undefined = undefined;
  website = '';

  toDto() {
    this.happenedAt = dayjs(this.happenedAt).unix();
    return this;
  }
}

export { CreateProjectFormDTO };
