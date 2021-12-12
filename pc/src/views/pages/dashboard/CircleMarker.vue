<template></template>
<script lang="ts">
import { defineComponent, getCurrentInstance, inject, onMounted, onUnmounted, Ref } from 'vue';
import { addEvents, events } from './events';
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
    const { $Amap } = getCurrentInstance()!.appContext.config.globalProperties;
    const map = inject<Ref<any>>('map');
    let marker: any = null;
    onMounted(() => {
      const crtMap = map?.value;
      if (crtMap) {
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
        crtMap.add(marker);
      }
    });
    onUnmounted(() => {
      const crtMap = map?.value;
      crtMap.remove(marker);
    });
    return {};
  },
});
</script>
