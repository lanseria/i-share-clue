import r from '/@/router/axios';
import { api } from './config';
import { TransfyFormDTO } from '/@/types/Admin/Transfy/dto';

export const getTransfyPageReq = (params: Partial<PageParam>) => {
  return r.request<R<PageResult<any>>>({
    url: api.page,
    method: 'GET',
    params,
  });
};

export const createTransfyReq = (data: TransfyFormDTO) => {
  return r.request<R<any>>({
    url: `${api.transfy}`,
    method: 'POST',
    data,
  });
};
