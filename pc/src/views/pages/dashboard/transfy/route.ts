import { AppRouteRecordRaw } from '/@/router/types';
import { authMetaFunc } from '/@/utils/route';

export const TransfyRoute: AppRouteRecordRaw = {
  path: 'transfy',
  name: 'Transfy',
  component: () => import('/@/views/layouts/default/index.vue'),
  redirect: '/dashboard/transfy/add-video-srt',
  meta: authMetaFunc('字幕转译'),
  children: [
    {
      path: 'add-video-srt',
      name: '添加视频字幕',
      component: () => import('./add-video-srt/index.vue'),
      meta: authMetaFunc('添加视频字幕'),
    },
    {
      path: ':id/video-edit',
      name: '视频字幕校对',
      component: () => import('./video-edit/index.vue'),
      meta: authMetaFunc('视频字幕校对'),
    },
  ],
};
