import storage from "store";

export const setUserToken = (v: Nullable<AuthTokenVO>) => {
  v ? storage.set("USER_TOKEN", v) : storage.remove("USER_TOKEN");
};

export const getUserToken = (): Nullable<AuthTokenVO> => {
  return storage.get("USER_TOKEN", null);
};
