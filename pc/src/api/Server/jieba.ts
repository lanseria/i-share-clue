import { requestWithSanic as r } from '/@/router/axios';

export const splitArticleReq = (data: string) => {
  return r.request<any>({
    url: `/split`,
    method: 'POST',
    data,
  });
};
