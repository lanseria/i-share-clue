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
