import { EngineModelKeyType, TransfyCategoryKeyType, TransfyStatusKeyType } from './enum';

interface TransfyFormVO {
  name: string;
  objectName: string;
  engineModel: EngineModelKeyType;
  category: TransfyCategoryKeyType;
}

interface TransfyVO extends TransfyFormVO {
  id: string;
  url: string;
  poster: string;
  recResJsonObjectName: string;
  recResJsonUrl: string;
  status: TransfyStatusKeyType;
  updatedAt: number;
  creator: UserInfoVO;
}
