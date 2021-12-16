<template></template>
<script lang="ts">
import { defineComponent, onMounted, onUnmounted } from 'vue';
import { DASHBOARD_MAP } from './const';
import { addEvents, events } from './events';
import { useMapStore } from '/@/store/modules/map';
export default defineComponent({
  props: {
    location: {
      type: Object,
      required: true,
    },
    extData: {
      type: Object,
      default: () => {},
    },
  },
  emits: [...events],
  setup(props, { emit }) {
    // global
    const mapStore = useMapStore();
    const $Amap = mapStore.Amap;

    let marker: any = null;
    onMounted(() => {
      const map = mapStore.getMap(DASHBOARD_MAP);
      if (map) {
        marker = new $Amap.CircleMarker({
          center: new $Amap.LngLat(props.location.lng, props.location.lat),
          radius: 10, //3D视图下，CircleMarker半径不要超过64px
          strokeColor: 'white',
          strokeWeight: 2,
          strokeOpacity: 0.5,
          fillColor: 'rgba(255,0,0,1)',
          fillOpacity: 0.5,
          zIndex: 10,
          bubble: true,
          cursor: 'pointer',
          clickable: true,
          extData: props.extData,
        });
        addEvents(marker, events, (event: any) => {
          emit(event.type, { event, extData: props.extData });
        });
        map.add(marker);
      }
    });
    onUnmounted(() => {
      const map = mapStore.getMap(DASHBOARD_MAP);
      map.remove(marker);
    });
    return {};
  },
});
</script>
