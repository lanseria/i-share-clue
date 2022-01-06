import { EngineModel } from '/@/global-enums/transfy.enum';
import type { EngineModelKeyType } from '/@/global-enums/transfy.enum';
import { keys } from 'lodash';

export const EngineModelKey = keys(EngineModel);
export { EngineModel };
export type { EngineModelKeyType };

import { TransfyCategory } from '/@/global-enums/transfy.enum';
import type { TransfyCategoryKeyType } from '/@/global-enums/transfy.enum';

export const TransfyCategoryKey = keys(TransfyCategory);
export { TransfyCategory };
export type { TransfyCategoryKeyType };
