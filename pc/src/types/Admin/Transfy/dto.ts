import { CommonDTO } from '../../Common/dto';
import { EngineModel } from './enum';
import type { EngineModelKeyType, TransfyCategoryKeyType } from './enum';
import { TransfyFormVO } from './vo';
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
