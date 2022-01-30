<template></template>
<script lang="ts" setup>
import { nanoid } from 'nanoid';
import { events } from './events';
import { massStyle } from './MassStyle';
import { useMapStore } from '/@/store/modules/map';
const props = defineProps({
  mid: {
    type: String,
    default: nanoid(),
  },
});
const emit = defineEmits([...events]);
// global
const mapStore = useMapStore();
const $Amap = mapStore.Amap;
let mass: any = new $Amap.MassMarks([], {
  opacity: 0.8,
  zIndex: 10,
  cursor: 'pointer',
  style: massStyle($Amap),
});
const map = mapStore.getMap(props.mid);
const marker = new $Amap.Marker({ content: ' ', map: map });
const refresh = (massList: any[]) => {
  mass.clear();
  mass.setData(massList);
  if (map) {
    mass.on('mouseover', function (e: any) {
      marker.setPosition(e.data.lnglat);
      marker.setLabel({ content: e.data.name });
    });
    mass.on('mouseout', function (e: any) {
      marker.setPosition(e.data.lnglat);
      marker.setLabel({ content: '' });
    });
    mass.on('click', (e: any) => {
      console.log(e.data);
      emit('click', e.data);
    });
    mass.setMap(map);
  }
};
defineExpose({
  refresh,
});
</script>
