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
        <n-button @click="refreshArea()">刷新区域</n-button>
      </n-space>
      <n-space style="margin-top: 6px">
        <n-dropdown trigger="hover" @select="handleSelect" :options="addOptions">
          <n-button>添加区域</n-button>
        </n-dropdown>
        <n-button @click="open()">开始编辑</n-button>
        <n-button @click="close()">结束编辑</n-button>
        <n-button @click="exportData()">导出数据</n-button>
        <n-upload ref="NUploadRef" :max="1" :show-file-list="false" :on-change="importData">
          <n-button>导入数据</n-button>
        </n-upload>
      </n-space>
      <n-space style="margin-top: 6px">
        <n-switch v-model:value="activeArea">
          <template #icon>🤔</template>
        </n-switch>
      </n-space>
    </n-el>
  </teleport>
</template>
<script lang="ts" setup>
import { NButton, NEl, NSpace, NDropdown, NCheckbox, NUpload, NSwitch } from 'naive-ui';
import { nanoid } from 'nanoid';
import { onMounted, onUnmounted, ref, shallowRef, watchEffect } from 'vue';
import { useMapStore } from '/@/store/modules/map';
import { validNull } from '/@/utils/Validation';
import { addOptions, OverlayItem, setPolygonOpt } from './Polygon';
import { stringDownload } from '/@/api/File';
import dayjs from 'dayjs';
import axios from 'axios';
const props = defineProps({
  mid: {
    type: String,
    default: nanoid(),
  },
});
const NUploadRef = shallowRef();
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
let geojsonOverlayGroup: any = null;
overlayGroupList.value = overlayGroups.map((m, i) => {
  return {
    name: addOptions[i].label,
    key: i,
    show: true,
  };
});
const activeArea = ref(true);
watchEffect(() => {
  if (activeArea.value) {
    geojsonOverlayGroup && geojsonOverlayGroup.show();
  } else {
    geojsonOverlayGroup && geojsonOverlayGroup.hide();
  }
  overlayGroups.forEach((m, i) => {
    if (m) {
      if (overlayGroupList.value[i].show) {
        m.show();
      } else {
        m.hide();
      }
    }
  });
});
const exportData = () => {
  stringDownload(JSON.stringify(mapStore.areaList, undefined, 2), `area-${dayjs().unix()}.json`);
};
const importData = async (options: any) => {
  window.$dialog.warning({
    title: '警告',
    content: '你确定替换所有区域记录？',
    positiveText: '确定',
    negativeText: '不确定',
    onPositiveClick: async () => {
      const text = await options.file.file.text();
      const data = JSON.parse(text);
      mapStore.setArea(data);
      refreshArea();
      NUploadRef.value.clear();
    },
    onNegativeClick: () => {
      //
    },
  });
};
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
  let area = poly?.getExtData();
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
  refreshArea();
  map.remove(poly);
};
const clearArea = () => {
  window.$dialog.warning({
    title: '警告',
    content: '你确定清空所有区域记录？',
    positiveText: '确定',
    negativeText: '不确定',
    onPositiveClick: () => {
      mapStore.clearArea();
      refreshArea();
    },
    onNegativeClick: () => {
      //
    },
  });
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
  polyEditor.addAdsorbPolygons(polygon);
  overlayGroups[area.type].addOverlay(polygon);
};
const overlayClear = () => {
  overlayGroups.forEach((m, i) => {
    if (m) {
      m.clearOverlays();
    }
  });
};
const refreshArea = () => {
  overlayClear();
  const areaList = mapStore.areaList;
  areaList.forEach((m) => {
    addPolygon(m);
  });
};
const loadArea = async () => {
  const res: any = await axios.get('/json/330100_full.json');
  geojsonOverlayGroup = new $Amap.GeoJSON({
    geoJSON: res.data,
    // 还可以自定义getMarker和getPolyline
    getPolygon: function (gj: any, lnglats: any) {
      // 计算面积
      const area = $Amap.GeometryUtil.ringArea(lnglats[0]);

      const geoPolygon = new $Amap.Polygon({
        path: lnglats,
        strokeOpacity: 0.3,
        strokeColor: '#ffffff',
        fillOpacity: 0.3,
        fillColor: '#ccebc5',
      });
      geoPolygon.on('mouseover', () => {
        geoPolygon.setOptions({
          fillColor: '#7bccc4',
        });
      });
      geoPolygon.on('mouseout', () => {
        geoPolygon.setOptions({
          fillColor: '#ccebc5',
        });
      });
      return geoPolygon;
    },
  });
  map.add(geojsonOverlayGroup);
};
onMounted(() => {
  refreshArea();
  loadArea();
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
onUnmounted(() => {
  overlayClear();
  geojsonOverlayGroup.clearOverlays();
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
  border-width: 0;
  border-radius: 0.4rem;
  position: absolute;
  top: 5px;
  left: 10px;
  flex: 1 1 auto;
  padding: 0.75rem 1.25rem;
  z-index: 10;
}
</style>
