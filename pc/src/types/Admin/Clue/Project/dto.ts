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
  desc = '描述疫情';
  // desc = '2022年1月31日（除夕）至2月6日（正月初六），全区道路公共泊位停车免收费';
  happenedAt = dayjs().valueOf();
  category = '2';
  region = '1';
  location: ProjectLocation | undefined = undefined;
  website = 'http://ivhik.cn';

  toDto() {
    this.happenedAt = dayjs(this.happenedAt).unix();
    return this;
  }
}

export { CreateProjectFormDTO };
