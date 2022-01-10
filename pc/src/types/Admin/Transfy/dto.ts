import { CommonDTO } from '../../Common/dto';
import { EngineModel, TransfyStatusKeyType } from './enum';
import type { EngineModelKeyType, TransfyCategoryKeyType } from './enum';
import { TransfyFormVO, TransfyVO } from './vo';
import { UserInfoDTO } from '../User/dto';
export { EngineModel, EngineModelKeyType };

export class TransfyFormDTO extends CommonDTO implements TransfyFormVO {
  engineModel: EngineModelKeyType = '16k_zh_video';
  name: string = '';
  objectName: string = '';
  category: TransfyCategoryKeyType = 'video';
  constructor(category: TransfyCategoryKeyType = 'video') {
    super();
    this.category = category;
  }
}

export class TransfyDTO extends CommonDTO implements TransfyVO {
  recResJsonObjectName: string = '';
  recResJsonUrl: string = '';
  id: string = '';
  url: string = '';
  poster: string = '';
  status: TransfyStatusKeyType = 'to_be_identifying';
  updatedAt: number = 0;
  name: string = '';
  objectName: string = '';
  engineModel: EngineModelKeyType = '16k_zh_video';
  category: TransfyCategoryKeyType = 'video';
  creator = new UserInfoDTO();
}
