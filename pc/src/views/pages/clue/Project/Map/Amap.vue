<template>
  <n-el :style="{ height: height }">
    <div ref="ContainerRef" class="cpt-fast-map" :style="{ height: height }">
      <div class="fast-map-slot-container">
        <slot v-if="mapLoaded"></slot>
      </div>
    </div>
  </n-el>
</template>
<script lang="ts" setup>
import { nanoid } from 'nanoid';
import { NEl } from 'naive-ui';
import { computed, onMounted, onUnmounted, shallowRef, watchEffect } from 'vue';
import { addEvents, events } from './events';
import { useAppStore } from '/@/store/modules/app';
import { useMapStore } from '/@/store/modules/map';
const props = defineProps({
  height: {
    type: String,
    default: '100%',
  },
  mid: {
    type: String,
    default: nanoid(),
  },
});
const emit = defineEmits([
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
]);
const styleThemeMap = {
  light: 'normal',
  dark: 'dark',
};
// use
const appStore = useAppStore();
// global
const mapStore = useMapStore();
const $Amap = mapStore.Amap;
// refs
const ContainerRef = shallowRef();
// ref
const mapLoaded = shallowRef(false);
// computed
const mapStyle = computed(() => {
  const theme = appStore.getTheme;
  return styleThemeMap[theme];
});
// method
const handleCompleteEvent = (event: any) => {
  mapLoaded.value = true;
  emit(event.type);
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
// methods
const clearInfoWindow = () => {
  const map = mapStore.getMap(props.mid);
  map.clearInfoWindow();
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
    showIndoorMap: false,
    isHotspot: false,
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
      console.log(data);
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
    mapStore.addMap(props.mid, newMap);
  } catch (e) {
    console.error(e);
  }
});
onUnmounted(() => {
  const map = mapStore.getMap(props.mid);
  map.destroy();
});
</script>
<style lang="css" scoped>
.fast-map-slot-container {
  position: relative;
  width: 100%;
  height: 100%;
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
.cpt-fast-map :deep(.amap-marker-label) {
  background-color: var(--base-color);
}
.cpt-fast-map :deep(.amap-info-sharp) {
  border-top: 8px solid var(--base-color);
}
</style>
