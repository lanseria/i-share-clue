<template>
  <teleport to="#dashboard-map">
    <n-el class="input-card">
      <n-space>
        <n-dropdown trigger="hover" @select="handleSelect" :options="options">
          <n-button @click="createPolygon()">新建</n-button>
        </n-dropdown>
        <n-button @click="open()">开始编辑</n-button>
        <n-button @click="close()">结束编辑</n-button>
        <n-button @click="clearArea()">清除所有区域</n-button>
      </n-space>
    </n-el>
  </teleport>
</template>
<script lang="ts" setup>
import { NButton, NEl, NSpace, NDropdown } from 'naive-ui';
import { nanoid } from 'nanoid';
import { onMounted } from 'vue';
import { useMapStore } from '/@/store/modules/map';
const props = defineProps({
  mid: {
    type: String,
    default: nanoid(),
  },
});
let currentType = 0;
const options = [
  {
    label: '封控区',
    key: 0,
  },
  {
    label: '管控区',
    key: 1,
  },
  {
    label: '防范区',
    key: 2,
  },
];

let polyEditor: any = null;
// global
const mapStore = useMapStore();
const $Amap = mapStore.Amap;
const createPolygon = () => {
  polyEditor.close();
  polyEditor.setTarget();
  polyEditor.open();
};
const open = () => {
  polyEditor.open();
};
const close = () => {
  polyEditor.close();
  const poly = polyEditor.getTarget();
  const area = poly.getExtData();
  console.log(area);
  mapStore.addArea(area.id, {
    ...area,
    path: poly.getPath(),
  });
};
const clearArea = () => {
  mapStore.clearArea();
};
const handleSelect = (key: number) => {
  currentType = key;
};
const addPolygon = (area: any) => {
  const map = mapStore.getMap(props.mid);
  const typeColorMap = {
    0: '#ba4e41',
    1: '#e49a83',
    2: '#eccfb1',
  };
  let polygon = new $Amap.Polygon({
    path: area.path,
    // @ts-ignore
    fillColor: typeColorMap[area.type],
    strokeOpacity: 1,
    fillOpacity: 0.5,
    strokeColor: '#2b8cbe',
    strokeWeight: 1,
    strokeStyle: 'dashed',
    strokeDasharray: [5, 5],
    extData: area,
  });
  polygon.on('mouseover', () => {
    polygon.setOptions({
      fillOpacity: 0.7,
      fillColor: '#7bccc4',
    });
  });
  polygon.on('mouseout', () => {
    polygon.setOptions({
      fillOpacity: 0.5,
      // @ts-ignore
      fillColor: typeColorMap[area.type],
    });
  });
  polygon.on('dblclick', () => {
    polyEditor.setTarget(polygon);
    polyEditor.open();
  });
  map.add(polygon);
};
onMounted(() => {
  const map = mapStore.getMap(props.mid);
  const areaList = mapStore.areaList;
  areaList.forEach((m) => {
    addPolygon(m);
  });
  polyEditor = new $Amap.PolygonEditor(map);
  polyEditor.on('add', (data: any) => {
    const polygon = data.target;
    const path = polygon.getPath();
    console.log(path);
    const id = nanoid();
    mapStore.addArea(id, {
      path,
      name: '未命名',
      id,
      type: currentType,
    });
    polyEditor.addAdsorbPolygons(polygon);
    polygon.on('dblclick', () => {
      polyEditor.setTarget(polygon);
      polyEditor.open();
    });
  });
});
defineExpose({
  createPolygon,
});
</script>
<style lang="css" scoped>
.input-card {
  display: flex;
  flex-direction: column;
  min-width: 0;
  word-wrap: break-word;
  background-color: var(--base-color);
  background-clip: border-box;
  border-radius: 0.25rem;
  border-width: 0;
  border-radius: 0.4rem;
  box-shadow: 0 2px 6px 0 rgba(114, 124, 245, 0.5);
  position: absolute;
  top: 5px;
  left: 10px;
  flex: 1 1 auto;
  padding: 0.75rem 1.25rem;
  z-index: 10;
}
</style>
