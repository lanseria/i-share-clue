import r from '/@/router/axios';
import { api } from './config';
import { CreateProjectFormDTO } from '/@/types/Admin/Clue/Project/dto';

export const getProjectById = (id: string) => {
  return r.request({
    url: `${api.project}/${id}`,
  });
};

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

export const exportProjectReq = () => {
  return r.request<R<any[]>>({
    url: `${api.export}`,
    method: 'POST',
  });
};

export const importProjectReq = (objectName: string) => {
  return r.request<R<any[]>>({
    url: `${api.import}/${objectName}`,
  });
};

export const downloadFiles = (url: string, filename: string) => {
  fetch(url).then((res) =>
    res.blob().then((blob) => {
      var a = document.createElement('a');
      var url = window.URL.createObjectURL(blob);
      var filename = 'myfile.zip';
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    })
  );
};
