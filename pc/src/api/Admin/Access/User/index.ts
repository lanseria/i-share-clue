import r from '/@/router/axios';
import { api } from './config';
/**
 * 删除用户
 * @param id 用户ID
 * @returns
 */
export const deleteUserReq = (id: string) => {
  return r.request({
    url: `${api.self}/${id}`,
    method: 'DELETE',
  });
};
/**
 * 拉白用户
 * @param id 用户ID
 * @returns
 */
export const whiteUserReq = (id: string) => {
  return r.request({
    url: `${api.white}/${id}`,
    method: 'POST',
  });
};
/**
 * 拉黑用户
 * @param id 用户ID
 * @returns
 */
export const blockUserReq = (id: string) => {
  return r.request({
    url: `${api.block}/${id}`,
    method: 'POST',
  });
};

/**
 * 简单登录用户信息获取
 */
export const userInfoReq = () => {
  return r.request<R<UserInfoLoginVO>>({
    url: api.info,
    method: 'GET',
  });
};

/**
 * 更新用户信息
 * @param data
 */
export const editDetailReq = (data: UserInfoVO) => {
  return r.request<R<UserInfoLoginVO>>({
    url: api.info,
    method: 'PUT',
    data,
  });
};
/**
 * 用户分页
 * @param params
 * @returns
 */
export const adminUserPageReq = (params: Partial<PageParam>) => {
  return r.request<R<PageResult<UserPageItemVO>>>({
    url: api.page,
    method: 'GET',
    params,
  });
};

/**
 * 创建用户
 * @param data
 */
export const createUserReq = (data: CreateUserFormVO) => {
  return r.request<R<boolean>>({
    url: api.base,
    method: 'POST',
    data,
  });
};
/**
 * 创建用户
 * @param data
 */
export const updateUserReq = (data: CreateUserFormVO) => {
  return r.request<R<boolean>>({
    url: `${api.base}/${data.id}`,
    method: 'PUT',
    data,
  });
};
