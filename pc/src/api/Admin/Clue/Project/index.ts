import r from '/@/router/axios';
import { api } from './config';
import { CreateProjectFormDTO } from '/@/types/Admin/Clue/Project/dto';

export const createProjectReq = (dto: CreateProjectFormDTO) => {
  return r.request<R<CreateProjectFormDTO>>({
    url: `${api.project}`,
    method: 'POST',
    data: dto,
  });
};

export const searchAreaProjectsReq = (bounds: AMapBounds) => {
  return r.request<R<ClueMark[]>>({
    url: `${api.area}/${bounds.northEast.kT}/${bounds.northEast.KL}/${bounds.southWest.kT}/${bounds.southWest.KL}`,
    method: 'GET',
  });
};

export const getProjectPageReq = (params: Partial<PageParam>) => {
  return r.request<R<PageResult<any>>>({
    url: api.page,
    method: 'GET',
    params,
  });
};

export const deleteProjectReq = (ids: string[]) => {
  return r.request<R<boolean>>({
    url: `${api.project}`,
    method: 'DELETE',
    data: ids,
  });
};
