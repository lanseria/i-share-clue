import { EngineModelKeyType, TransfyCategoryKeyType, TransfyStatusKeyType } from './enum';

interface TransfyFormVO {
  name: string;
  url: string;
  engineModel: EngineModelKeyType;
  category: TransfyCategoryKeyType;
}

interface TransfyVO extends TransfyFormVO {
  id: string;
  poster: string;
  status: TransfyStatusKeyType;
  updatedAt: number;
}
