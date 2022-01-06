import r from '/@/router/axios';
import { api } from './config';
import { TransfyFormDTO } from '/@/types/Admin/Transfy/dto';

export const createTransfyReq = (data: TransfyFormDTO) => {
  return r.request<R<any>>({
    url: `${api.transfy}`,
    method: 'POST',
    data,
  });
};
