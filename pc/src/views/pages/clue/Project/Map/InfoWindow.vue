<template>
  <div ref="el">
    <n-el>
      <div class="bottom-center amap-info-contentContainer amap-info-window">
        <div class="amap-info-content amap-info-outer">
          <div class="input-card content-window-card">
            <p>{{ iW.title }}</p>
            <p>{{ iW.desc }}</p>
          </div>
          <a class="amap-info-close" href="javascript: void(0)">×</a>
        </div>
        <div class="amap-info-sharp"></div>
      </div>
    </n-el>
  </div>
</template>
<script lang="ts">
import { NEl } from 'naive-ui';
import { nanoid } from 'nanoid';
import { defineComponent, onMounted, onUnmounted, ref } from 'vue';
import { addEvents, events } from './events';
import { useMapStore } from '/@/store/modules/map';
export default defineComponent({
  props: {
    mid: {
      type: String,
      default: nanoid(),
    },
  },
  components: {
    NEl,
  },
  emits: [...events],
  setup(props, { emit }) {
    // global
    const mapStore = useMapStore();
    const $Amap = mapStore.Amap;
    const el = ref<HTMLElement>();
    const iW = ref<IObj>({
      title: '',
      desc: '',
    });
    let infoWindow: any = null;

    const open = (lng: number, lat: number, target: IObj) => {
      iW.value = target;
      setTimeout(() => {
        infoWindow = new $Amap.InfoWindow({
          isCustom: true, //使用自定义窗体
          content: el.value!.outerHTML, //使用默认信息窗体框样式，显示信息内容
          offset: new $Amap.Pixel(0, -16),
        });
        const map = mapStore.getMap(props.mid);
        infoWindow.open(map, [lng, lat]);
      }, 200);
    };

    onMounted(() => {
      // addEvents(infoWindow, events, (event: any) => {
      //   emit(event.type, { event });
      // });
    });

    onUnmounted(() => {
      const map = mapStore.getMap(props.mid);
      map.clearInfoWindow();
    });
    return {
      el,
      iW,
      // method
      open,
    };
  },
});
</script>
<style>
.amap-info-window {
  max-width: 500px;
  min-width: 200px;
}
.amap-info-content {
  position: relative;
  background-color: var(--base-color);
  padding: 10px 18px 10px 10px;
  line-height: 1.4;
  overflow: auto;
}
</style>
