import r from "/@/router/axios";
import { api } from "./config";
import { CreateProjectFormDTO } from "/@/types/Admin/Clue/Project/dto";

export const createProjectReq = (dto: CreateProjectFormDTO) => {
  return r.request<R<CreateProjectFormDTO>>({
    url: `${api.project}`,
    method: "POST",
    data: dto
  });
};

export const searchAreaProjectsReq = (bounds: AMapBounds) => {
  return r.request<R<unknown>>({
    url: `${api.area}/${bounds.northEast.lat}/${bounds.northEast.lng}/${bounds.southWest.lat}/${bounds.southWest.lng}`,
    method: "GET"
  });
};
