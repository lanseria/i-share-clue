import { AppRouteRecordRaw } from '/@/router/types';
import { authMetaFunc } from '/@/utils/route';

export const myRoute: AppRouteRecordRaw[] = [
  {
    path: 'base',
    name: 'Base',
    meta: authMetaFunc('基本信息', {
      icon: 'icon-user_info',
    }),
    component: () => import('./base/index.vue'),
  },
  {
    path: 'user-list',
    name: 'UserList',
    meta: authMetaFunc('用户管理', {
      icon: 'icon-user_list',
    }),
    component: () => import('./user-list/index.vue'),
  },
  {
    path: 'dict-list',
    name: 'DictList',
    meta: authMetaFunc('字典管理', {
      icon: 'icon-dict_list',
    }),
    component: () => import('./dict-list/index.vue'),
  },
  {
    path: 'project-list',
    name: 'ProjectList',
    meta: authMetaFunc('项目管理', {
      icon: 'icon-project_list',
    }),
    component: () => import('./project-list/index.vue'),
  },
  {
    path: 'file-list',
    name: 'FileList',
    meta: authMetaFunc('文件管理', {
      icon: 'icon-file_list',
    }),
    component: () => import('./file-list/index.vue'),
  },
  {
    path: 'transfy-control',
    name: 'TransfyControl',
    meta: authMetaFunc('字幕转译', {
      icon: 'icon-transfy_list',
    }),
    component: () => import('./transfy/index.vue'),
  },
  {
    path: 'youtubedl-control',
    name: 'YoutubedlControl',
    meta: authMetaFunc('音视频下载', {
      icon: 'icon-youtubedl',
    }),
    component: () => import('./youtubedl/index.vue'),
  },
];
