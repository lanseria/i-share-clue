<template>
  <div ref="ContainerRef" class="cpt-fast-map" :style="{ height: height }">
    <div class="fast-map-slot-container">
      <slot v-if="mapLoaded"></slot>
    </div>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, getCurrentInstance, onMounted, provide, reactive, Ref, ref, watchEffect } from 'vue';
import { addEvents, events } from './events';
import { useAppStore } from '/@/store/modules/app';
const styleThemeMap = {
  light: 'normal',
  dark: 'dark',
};
export default defineComponent({
  name: 'FastAMap',
  props: {
    height: {
      type: String,
      default: '100%',
    },
  },
  emits: [
    'location-complete',
    'mapmove',
    'complete',
    'movestart',
    'moveend',
    'zoomchange',
    'zoomstart',
    'zoomend',
    'dragstart',
    'dragging',
    'dragend',
    'resize',
    ...events,
  ],
  setup(props, { emit }) {
    // use
    const appStore = useAppStore();
    // comp
    let map: Ref<any> = ref<any>({});
    provide('map', map);
    // global
    const $Amap = getCurrentInstance()!.appContext.config.globalProperties.$Amap;
    // refs
    const ContainerRef = ref();
    // ref
    const mapLoaded = ref(false);
    // computed
    const mapStyle = computed(() => {
      const theme = appStore.getTheme;
      return styleThemeMap[theme];
    });
    // method
    const handleCompleteEvent = (event: any) => {
      mapLoaded.value = true;
      emit(event.type, { event, map });
    };

    const handleMapmoveEvent = () => {
      emit('mapmove');
    };

    const handleMovestartEvent = () => {
      emit('movestart');
    };

    const handleMoveendEvent = () => {
      emit('moveend');
    };

    const handleZoomchangeEvent = () => {
      emit('zoomchange');
    };

    const handleZoomstartEvent = () => {
      emit('zoomstart');
    };

    const handleZoomendEvent = () => {
      emit('zoomend');
    };

    const handleDragstartEvent = () => {
      emit('dragstart');
    };

    const handleDraggingEvent = () => {
      emit('dragging');
    };

    const handleDragendEvent = () => {
      emit('dragend');
    };

    const handleResizeEvent = () => {
      emit('resize');
    };
    // hook
    onMounted(() => {
      const options = {
        resizeEnable: true, //是否监控地图容器尺寸变化
        zoom: 17, //初始地图级别
        pitch: 75, // 地图俯仰角度，有效范围 0 度- 83 度
        viewMode: '2D', // 地图模式
        mapStyle: `amap://styles/${mapStyle.value}`, //设置地图的显示样式
        features: ['bg', 'road', 'building', 'point'],
      };

      try {
        const newMap = new $Amap.Map(ContainerRef.value, options);
        newMap.on('mapmove', handleMapmoveEvent);
        newMap.on('complete', handleCompleteEvent);
        newMap.on('movestart', handleMovestartEvent);
        newMap.on('moveend', handleMoveendEvent);
        newMap.on('zoomchange', handleZoomchangeEvent);
        newMap.on('zoomstart', handleZoomstartEvent);
        newMap.on('zoomend', handleZoomendEvent);
        newMap.on('dragstart', handleDragstartEvent);
        newMap.on('dragging', handleDraggingEvent);
        newMap.on('dragend', handleDragendEvent);
        newMap.on('resize', handleResizeEvent);
        addEvents(newMap, events, (event: any) => {
          emit(event.type, event);
        });

        // watch
        watchEffect(() => {
          const styleName = 'amap://styles/' + mapStyle.value;
          newMap.setMapStyle(styleName);
        });
        //
        const geolocation = new $Amap.Geolocation({
          // 是否使用高精度定位，默认：true
          enableHighAccuracy: true,
          // 设置定位超时时间，默认：无穷大
          timeout: 10000,
          //  定位按钮的排放位置,  RB表示右下
          buttonPosition: 'RB',
          // 定位按钮的停靠位置的偏移量，默认：Pixel(10, 20)
          // buttonOffset: new AMap.Pixel(-100, -100),
          //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
          zoomToAccuracy: true,
        });
        newMap.addControl(geolocation);

        function onComplete(data: any) {
          emit('location-complete', {
            data,
            map: newMap,
          });
          // data是具体的定位信息
        }

        function onError(data: any) {
          // console.log(data);
          // 定位出错
        }
        geolocation.getCurrentPosition(function (status: any, result: any) {
          if (status == 'complete') {
            onComplete(result);
          } else {
            onError(result);
          }
        });
        //
        map.value = newMap;
        // //创建右键菜单
        // const contextMenu = new AMap.ContextMenu();
        // let contextMenuPositon = "";
        // //右键添加Marker标记
        // contextMenu.addItem(
        //   "添加标记",
        //   function (e: any) {
        //     var marker = new AMap.Marker({
        //       map: map,
        //       position: contextMenuPositon //基点位置
        //     });
        //   },
        //   3
        // );

        // //地图绑定鼠标右击事件——弹出右键菜单
        // map.on("rightclick", function (e) {
        //   contextMenu.open(map, e.lnglat);
        //   contextMenuPositon = e.lnglat;
        // });
      } catch (e) {
        console.error(e);
      }
    });
    return {
      ContainerRef,
      // ref
      mapLoaded,
    };
  },
});
</script>
<style lang="css" scoped>
.fast-map-slot-container {
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 999;
  overflow: hidden;
  pointer-events: none;
}
.cpt-fast-map {
  position: relative;
  overflow: hidden;
}
.cpt-fast-map :deep(.amap-content-body),
.cpt-fast-map :deep(.amap-lib-infowindow-title),
.cpt-fast-map :deep(.amap-lib-infowindow-content),
.cpt-fast-map :deep(.amap-menu-outer),
.cpt-fast-map :deep(.amap-info-content),
.cpt-fast-map :deep(.amap-menu-outer li:hover) {
  background-color: var(--color);
}
.cpt-fast-map :deep(.amap-info-sharp) {
  border-top: 8px solid var(--color);
}
</style>
