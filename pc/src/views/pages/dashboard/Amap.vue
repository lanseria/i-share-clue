<template>
  <div ref="ContainerRef" class="cpt-fast-map" :style="{ height: height }">
    <div class="fast-map-slot-container">
      <slot v-if="mapLoaded"></slot>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, getCurrentInstance, onMounted, provide, ref } from 'vue';
const events = [
  'click',
  'dblclick',
  'hotspotclick',
  'hotspotover',
  'hotspotout',
  'mousemove',
  'mousewheel',
  'mouseover',
  'mouseout',
  'mouseup',
  'mousedown',
  'rightclick',
  'touchstart',
  'touchmove',
  'touchend',
];

export default defineComponent({
  name: 'FastAMap',
  props: {
    height: {
      type: String,
      default: '100%',
    },
  },
  emits: ['mapmove', 'complete', 'movestart', 'moveend', 'zoomchange', 'zoomstart', 'zoomend', 'dragstart', 'dragging', 'dragend', 'resize', ...events],
  setup(props, { emit }) {
    // comp
    let map: any = null;
    provide('map', map);
    // global
    const $Amap = getCurrentInstance()!.appContext.config.globalProperties.$Amap;
    // refs
    const ContainerRef = ref();
    // ref
    const mapLoaded = ref(false);
    // method

    const handleCompleteEvent = (event: any) => {
      mapLoaded.value = true;
      emit(event.type, event, map);
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
    const addEvents = (map: any, events: string[], hanleEvents: Function) => {
      events.forEach((event) => {
        // 注册事件，并传入通用函数处理方法
        map.on(event, hanleEvents);
      });
    };
    // hook
    onMounted(() => {
      const options = {
        resizeEnable: true, //是否监控地图容器尺寸变化
        zoom: 17, //初始地图级别
        pitch: 75, // 地图俯仰角度，有效范围 0 度- 83 度
        viewMode: '2D', // 地图模式
        mapStyle: 'amap://styles/dark', //设置地图的显示样式
        features: ['bg', 'road', 'building', 'point'],
      };
      try {
        map = new $Amap.Map(ContainerRef.value, options);
        map.on('mapmove', handleMapmoveEvent);
        map.on('complete', handleCompleteEvent);
        map.on('movestart', handleMovestartEvent);
        map.on('moveend', handleMoveendEvent);
        map.on('zoomchange', handleZoomchangeEvent);
        map.on('zoomstart', handleZoomstartEvent);
        map.on('zoomend', handleZoomendEvent);
        map.on('dragstart', handleDragstartEvent);
        map.on('dragging', handleDraggingEvent);
        map.on('dragend', handleDragendEvent);
        map.on('resize', handleResizeEvent);
        addEvents(map, events, (event: any) => {
          emit(event.type, event);
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
        map.addControl(geolocation);

        function onComplete(data: any) {
          console.log(data);
          // data是具体的定位信息
        }

        function onError(data: any) {
          console.log(data);
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
</style>
