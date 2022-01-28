<template></template>
<script lang="ts" setup>
import { nanoid } from 'nanoid';
import { events } from './events';
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

const style = [
  {
    url: 'https://webapi.amap.com/images/mass/mass0.png',
    anchor: new $Amap.Pixel(6, 6),
    size: new $Amap.Size(11, 11),
    zIndex: 3,
  },
  {
    url: 'https://webapi.amap.com/images/mass/mass1.png',
    anchor: new $Amap.Pixel(4, 4),
    size: new $Amap.Size(7, 7),
    zIndex: 2,
  },
  {
    url: 'https://webapi.amap.com/images/mass/mass2.png',
    anchor: new $Amap.Pixel(3, 3),
    size: new $Amap.Size(5, 5),
    zIndex: 1,
  },
];
const map = mapStore.getMap(props.mid);
const marker = new $Amap.Marker({ content: ' ', map: map });
const refresh = (massList: any[]) => {
  const mass = new $Amap.MassMarks(massList, {
    opacity: 0.8,
    zIndex: 111,
    cursor: 'pointer',
    style: style,
  });
  if (map) {
    mass.on('mouseover', function (e: any) {
      marker.setPosition(e.data.lnglat);
      marker.setLabel({ content: e.data.name });
    });

    mass.setMap(map);
  }
};
defineExpose({
  refresh,
});
</script>
