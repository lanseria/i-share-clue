import { createApp } from 'vue';
import AMapLoader from '@amap/amap-jsapi-loader';
import App from './App.vue';
import { setupRouterGuard } from '/@/router/guard';
import { router, setupRouter } from '/@/router';
import { setupStore } from '/@/store';

import '/@/styles/index.css';
import { initAppConfigStore } from './logic/initAppConfig';
import { registerGlobComp } from './components/registerGlobComp';
import MapRegistry from './views/pages/dashboard/MapRegistry';

async function bootstrap() {
  const app = createApp(App);
  // 设置地图
  app.config.globalProperties.$Amap = await AMapLoader.load({
    //首次调用 load
    key: import.meta.env.VITE_AMAP_KEY, //首次load key为必填
    version: '2.0',
    plugins: ['AMap.Scale', 'AMap.ToolBar', 'AMap.PlaceSearch', 'AMap.Geolocation'],
  });
  app.config.globalProperties.$MapRegistry = new MapRegistry();
  // Configure store
  setupStore(app);

  // Initialize internal system configuration
  initAppConfigStore();

  // Register global components
  registerGlobComp(app);

  // Multilingual configuration
  // await setupI18n(app);

  // Configure routing
  setupRouter(app);

  // router-guard
  setupRouterGuard();

  // Register global directive
  // setupGlobDirectives(app);

  // Configure global error handling
  // setupErrorHandle(app);

  // Mount when the route is ready
  // https://next.router.vuejs.org/api/#isready
  // await router.isReady();

  app.mount('#app', true);
}

void bootstrap();
