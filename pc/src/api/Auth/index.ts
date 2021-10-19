import r from "/@/router/axios";
import { SmsLoginDTO } from "/@/types/Admin/User/dto";
import { api, initalAppendForm, initalHeader } from "./config";

export const loginReq = (data: LoginVO) => {
  return r.request<R<AuthLoginVO>>({
    url: api.login,
    method: "POST",
    headers: initalHeader,
    data
    // params: {
    //   ...data,
    //   ...initalAppendForm()
    // }
  });
};

export const smsLoginReq = (data: SmsLoginVO) => {
  const smsLoginDto = new SmsLoginDTO(data);
  return r.request<R<AuthLoginVO>>({
    url: api.smsLogin,
    headers: initalHeader,
    method: "POST",
    params: {
      ...smsLoginDto,
      ...initalAppendForm("mobile")
    }
  });
};

export const logoutReq = () => {
  return r.request<R<boolean>>({
    url: api.logout,
    method: "DELETE"
  });
};
