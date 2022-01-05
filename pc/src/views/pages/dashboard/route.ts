import { DASHBOARD_NAME } from '/@/router/constant';
import { AppRouteRecordRaw } from '/@/router/types';
import { authMetaFunc } from '/@/utils/route';
import { TransfyRoute } from './transfy/route';
export const DashboardRoute: AppRouteRecordRaw = {
  path: '/dashboard',
  name: DASHBOARD_NAME,
  component: () => import('/@/views/layouts/dashboard/index.vue'),
  redirect: '/dashboard/index',
  meta: authMetaFunc('首页'),
  children: [
    {
      path: 'index',
      name: DASHBOARD_NAME,
      component: () => import('./index/index.vue'),
      meta: authMetaFunc('欢迎页面'),
    },
    {
      path: 'clue-map',
      name: '寻找地图',
      component: () => import('./clue-map/index.vue'),
      meta: authMetaFunc('寻找地图'),
    },
    TransfyRoute,
  ],
};
