import r from '/@/router/axios';
import { DictDTO } from '/@/types/Admin/Dict/dto';
import { api } from './config';
import { TreeSelectOption } from 'naive-ui';

export const getDictReq = (id: number) => {
  return r.request<R<DictDTO>>({
    url: `${api.dict}/${id}`,
    method: 'GET',
  });
};

export const getDictTreeReq = () => {
  return r.request<R<TreeSelectOption[]>>({
    url: `${api.dictTree}`,
    method: 'GET',
  });
};

export const getDictPageReq = (params: Partial<PageParam>) => {
  return r.request<R<PageResult<AdminDictPageItemVO>>>({
    url: api.dictPage,
    method: 'GET',
    params,
  });
};

export const createDictReq = (data: DictDTO) => {
  return r.request<R<boolean>>({
    url: api.dict,
    method: 'POST',
    data,
  });
};

export const updateDictReq = (data: DictDTO) => {
  return r.request<R<boolean>>({
    url: api.dict,
    method: 'PUT',
    data,
  });
};

export const deleteDictReq = (ids: string[]) => {
  return r.request<R<boolean>>({
    url: `${api.dict}`,
    method: 'DELETE',
    data: ids,
  });
};

export const getDictAllMapReq = () => {
  return r.request<R<DictDirectory>>({
    url: api.getDictAllMap,
    method: 'GET',
  });
};
