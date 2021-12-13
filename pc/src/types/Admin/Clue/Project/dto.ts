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
  website = 'http://ivhik.cn';
  desc = '描述疫情';
  category = '1';
  region = '1';
  location: ProjectLocation | undefined = undefined;
}

export { CreateProjectFormDTO };
