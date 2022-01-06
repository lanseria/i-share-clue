import { EngineModel } from '../../../../../enums/Transfy.enum';
import type { EngineModelKeyType, EngineModelType } from '../../../../../enums/Transfy.enum';
import { CommonDTO } from '../../Common/dto';
export { EngineModel, EngineModelKeyType, EngineModelType };

export class TransfyFormDTO extends CommonDTO implements TransfyFormVO {
  name: string = '';
  url: string = '';
  engineModelType: EngineModelKeyType = '16k_zh_video';
}
