import r from '/@/router/axios';
import { api } from './config';
import { TransfyFormDTO } from '/@/types/Admin/Transfy/dto';
import { TransfyVO } from '/@/types/Admin/Transfy/vo';
import { SubtitlesItem } from '/@/global-enums/subtitles.enum';

export const resplitSubtitleReq = (id: string) => {
  return r.request<R<any>>({
    url: `${api.resplit}/${id}`,
  });
};

export const updateSubtitleForTransfyReq = (id: string, data: SubtitlesItem[]) => {
  return r.request<R<boolean>>({
    url: `${api.subtitles}/${id}`,
    method: 'PATCH',
    data,
  });
};

export const getSubtitlesReq = async (url: string) => {
  const response: SubtitlesItem[] = await fetch(url, {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  }).then((response) => response.json());
  return response;
};

export const getTransfyReq = (id: string) => {
  return r.request<R<TransfyVO>>({
    url: `${api.transfy}/${id}`,
  });
};

export const runTransfyRecTaskReq = (id: string) => {
  return r.request<R<boolean>>({
    url: `${api.runRec}/${id}`,
  });
};

export const deleteTransfyReq = (ids: string[]) => {
  return r.request<R<boolean>>({
    url: `${api.transfy}`,
    method: 'DELETE',
    data: ids,
  });
};

export const getTransfyPageReq = (params: Partial<PageParam>) => {
  return r.request<R<PageResult<TransfyVO>>>({
    url: api.page,
    params,
  });
};

export const createTransfyReq = (data: TransfyFormDTO) => {
  return r.request<R<TransfyVO>>({
    url: `${api.transfy}`,
    method: 'POST',
    data,
  });
};
