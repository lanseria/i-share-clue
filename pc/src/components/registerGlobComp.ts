import type { App } from 'vue';
import vue3videoPlay from 'vue3-video-play'; // 引入组件
import 'vue3-video-play/dist/style.css'; // 引入css
// import { Icon } from './Icon';
import ImpPageContainer from './global/ImpPageContainer.vue';
import ImpImage from './global/ImpImage.vue';
import ImpModal from './global/ImpModal.vue';

const compList = [ImpPageContainer, ImpImage, ImpModal];

export function registerGlobComp(app: App) {
  app.use(vue3videoPlay);
  compList.forEach((comp) => {
    app.component(comp.name || comp.displayName, comp);
  });
  // 注册一个全局自定义指令 `v-focus`
  app.directive('advanceClick', {
    mounted(el: HTMLElement, binding) {
      let move = false;
      el.addEventListener('mousemove', () => {
        move = true;
      });
      el.addEventListener('mousedown', () => {
        move = false;
      });
      el.addEventListener('mouseup', (e) => {
        move ? e.preventDefault() : binding.value();
      });
    },
  });
}
