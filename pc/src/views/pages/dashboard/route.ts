import { DASHBOARD_NAME } from "/@/router/constant";
import { AppRouteRecordRaw } from "/@/router/types";
import { authMetaFunc } from "/@/utils/route";

export const DashboardRoute: AppRouteRecordRaw = {
  path: "/dashboard",
  name: DASHBOARD_NAME,
  component: () => import("/@/views/layouts/dashboard/index.vue"),
  redirect: "/dashboard/index",
  meta: authMetaFunc("寻找地图"),
  children: [
    {
      path: "index",
      name: DASHBOARD_NAME,
      component: () => import("./index.vue"),
      meta: authMetaFunc("首页")
    }
  ]
};
