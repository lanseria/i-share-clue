<template>
  <div ref="el">
    <slot />
  </div>
</template>
<script lang="ts">
import { defineComponent, getCurrentInstance, inject, onMounted, onUnmounted, Ref, ref } from 'vue';
import { addEvents, events } from './events';
export default defineComponent({
  emits: [...events],
  setup(props, { emit }) {
    const { $Amap } = getCurrentInstance()!.appContext.config.globalProperties;
    const map = inject<Ref<any>>('map');
    const el = ref<HTMLElement>();
    let infoWindow: any = null;

    const open = (lng: number, lat: number) => {
      infoWindow = new $Amap.InfoWindow({
        content: el.value!.outerHTML, //使用默认信息窗体框样式，显示信息内容
      });
      const crtMap = map?.value;
      crtMap && infoWindow.open(crtMap, [lng, lat]);
    };

    onMounted(() => {
      // addEvents(infoWindow, events, (event: any) => {
      //   emit(event.type, { event });
      // });
    });

    // onUnmounted(() => {
    //   const crtMap = map?.value;
    //   crtMap && crtMap.remove(infoWindow);
    // });
    return {
      el,
      // method
      open,
    };
  },
});
</script>
