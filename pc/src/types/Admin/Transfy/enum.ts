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

import { TransfyStatus } from '/@/global-enums/transfy.enum';
import type { TransfyStatusKeyType } from '/@/global-enums/transfy.enum';

export const TransfyStatusKey = keys(TransfyStatus);
export { TransfyStatus };
export type { TransfyStatusKeyType };
