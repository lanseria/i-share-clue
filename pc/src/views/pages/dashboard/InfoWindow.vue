<template>
  <div ref="el">
    <slot />
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref } from 'vue';
import { DASHBOARD_MAP } from './const';
import { addEvents, events } from './events';
import { useMapStore } from '/@/store/modules/map';
export default defineComponent({
  emits: [...events],
  setup(props, { emit }) {
    // global
    const mapStore = useMapStore();
    const $Amap = mapStore.Amap;
    const el = ref<HTMLElement>();
    let infoWindow: any = null;

    const open = (lng: number, lat: number) => {
      infoWindow = new $Amap.InfoWindow({
        content: el.value!.outerHTML, //使用默认信息窗体框样式，显示信息内容
      });
      const map = mapStore.getMap(DASHBOARD_MAP);
      infoWindow.open(map, [lng, lat]);
    };

    onMounted(() => {
      // addEvents(infoWindow, events, (event: any) => {
      //   emit(event.type, { event });
      // });
    });

    onUnmounted(() => {
      const map = mapStore.getMap(DASHBOARD_MAP);
      map.clearInfoWindow();
    });
    return {
      el,
      // method
      open,
    };
  },
});
</script>
