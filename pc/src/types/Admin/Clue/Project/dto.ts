import { CommonDTO } from "/@/types/Common/dto";

export class ProjectLocation {
  lat: number;
  lng: number;

  constructor(that: ProjectLocation) {
    this.lat = that.lat;
    this.lng = that.lng;
  }
}

class CreateProjectFormDTO extends CommonDTO {
  name = "";
  website = "";
  desc = "";
  category = "";
  region = "";
  location: ProjectLocation | undefined = undefined;
}

export { CreateProjectFormDTO };
