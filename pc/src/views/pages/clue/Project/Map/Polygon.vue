<template>
  <teleport to="#dashboard-map">
    <n-el class="input-card">
      <n-space item-style="display: flex;" align="center">
        <n-checkbox
          v-for="(item, idx) in overlayGroupList"
          :key="item.key"
          :checked="item.show"
          @update:checked="
            (value) => {
              overlayGroupList[idx].show = value;
            }
          "
        >
          {{ item.name }}
        </n-checkbox>
        <n-button @click="clearArea()">清除所有区域</n-button>
      </n-space>
      <n-space>
        <n-dropdown trigger="hover" @select="handleSelect" :options="addOptions">
          <n-button>新建</n-button>
        </n-dropdown>
        <n-button @click="open()">开始编辑</n-button>
        <n-button @click="close()">结束编辑</n-button>
      </n-space>
    </n-el>
  </teleport>
</template>
<script lang="ts" setup>
import { NButton, NEl, NSpace, NDropdown, NCheckbox } from 'naive-ui';
import { nanoid } from 'nanoid';
import { onMounted, ref, watchEffect } from 'vue';
import { useMapStore } from '/@/store/modules/map';
import { validNull } from '/@/utils/Validation';
import { addOptions, OverlayItem, setPolygonOpt } from './Polygon';
const props = defineProps({
  mid: {
    type: String,
    default: nanoid(),
  },
});

let currentType = 0;
// global
const mapStore = useMapStore();
const overlayGroupList = ref<OverlayItem[]>([]);
const $Amap = mapStore.Amap;
const map = mapStore.getMap(props.mid);
const polyEditor = new $Amap.PolygonEditor(map);
const overlayGroups = addOptions.map((m) => {
  const overlayGroup = new $Amap.OverlayGroup([]);
  map.add(overlayGroup);
  return overlayGroup;
});
overlayGroupList.value = overlayGroups.map((m, i) => {
  return {
    name: addOptions[i].label,
    key: i,
    show: true,
  };
});
watchEffect(() => {
  overlayGroups.map((m, i) => {
    if (m) {
      console.log(overlayGroupList.value[i].show);
      if (overlayGroupList.value[i].show) {
        m.show();
      } else {
        m.hide();
      }
    }
  });
});
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
  let area = poly.getExtData();
  // 如果是编辑的话
  if (!validNull(area)) {
    console.log(area);
    area = {
      ...area,
      path: poly.getPath(),
    };
    mapStore.addArea(area.id, area);
  }
  // 新增则跳过
};
const clearArea = () => {
  mapStore.clearArea();
};
const handleSelect = (key: number) => {
  currentType = key;
  createPolygon();
};
const addPolygon = (area: any) => {
  const polygon = new $Amap.Polygon({});
  setPolygonOpt(polygon, area);
  polygon.on('dblclick', () => {
    polyEditor.setTarget(polygon);
    polyEditor.open();
  });
  overlayGroups[area.type].addOverlay(polygon);
};
onMounted(() => {
  const areaList = mapStore.areaList;
  areaList.forEach((m) => {
    addPolygon(m);
  });
  polyEditor.on('add', (data: any) => {
    const polygon = data.target;
    const path = polygon.getPath();
    const id = nanoid();
    const area = {
      path,
      name: '未命名',
      id,
      type: currentType,
    };
    console.log(area);
    mapStore.addArea(id, area);
    polyEditor.addAdsorbPolygons(polygon);
    polygon.setOptions({
      extData: area,
    });
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
