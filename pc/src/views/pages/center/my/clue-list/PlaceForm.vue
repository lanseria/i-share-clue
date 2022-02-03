<template>
  <n-form style="margin-top: 20px" label-placement="left" :model="modelPlace" ref="formRef">
    <n-form-item label="元数据">
      <n-input-group>
        <n-input v-model:value="modelPlace.metadata" clearable></n-input>
        <n-button type="primary" @click="search()" ghost>搜索</n-button>
      </n-input-group>
    </n-form-item>
    <n-form-item label="地点名称">
      <n-input v-model:value="modelPlace.name"></n-input>
    </n-form-item>
    <div class="form-map">
      <Amap :mid="PLACE_FORM">
        <MassMarker ref="MassMakerRef" :mid="PLACE_FORM"></MassMarker>
      </Amap>
    </div>
    <n-form-item>
      <n-button @click="handleSub()">提交</n-button>
    </n-form-item>
  </n-form>
</template>
<script lang="ts" setup>
import { NForm, NFormItem, NInput, NButton, NInputGroup } from 'naive-ui';
import { onMounted, ref, shallowRef } from 'vue';
import { PlaceFormDTO, useClueStore } from '/@/store/modules/clue';
import { useMapStore } from '/@/store/modules/map';
import { ProjectLocation } from '/@/types/Admin/Clue/Project/dto';
import Amap from '/@/views/pages/clue/Project/Map/Amap.vue';
import MassMarker from '/@/views/pages/clue/Project/Map/MassMarker.vue';
const clueStore = useClueStore();

// global
const mapStore = useMapStore();
const $Amap = mapStore.Amap;
const PLACE_FORM = 'place-form';
let map: any = null;
let markers: any[] = [];
onMounted(() => {
  map = mapStore.getMap(PLACE_FORM);
});
//构造地点查询类
const placeSearch = new $Amap.PlaceSearch({
  pageSize: 5, // 单页显示结果条数
  pageIndex: 1, // 页码
  city: '杭州', // 兴趣点城市
  citylimit: true, //是否强制限制在设置的城市内搜索
});
const modelPlace = ref(new PlaceFormDTO());
// refs
const MassMakerRef = shallowRef();
// 清除 marker
const _clearMarker = (marker: any) => {
  if (marker) {
    marker.setMap(null);
    marker = null;
  }
};
const clearSearch = () => {
  markers.forEach((m) => {
    _clearMarker(m);
  });
  markers = [];
  console.log(markers);
};
const search = () => {
  placeSearch.search(modelPlace.value.metadata, (status: string, result: any) => {
    clearSearch();
    console.log(result);
    const pois = result.poiList.pois;
    for (var i = 0; i < pois.length; i++) {
      const poi = pois[i];
      markers[i] = new $Amap.Marker({
        position: poi.location, // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
        title: poi.name,
      });
      markers[i].on('click', (e: any) => {
        const title = poi.name;
        const position = poi.location;
        console.log(title, position);
        modelPlace.value.name = title;
        modelPlace.value.location = new ProjectLocation(position);
      });
      // 将创建的点标记添加到已有的地图实例：
      map.add(markers[i]);
    }
    map.setFitView(
      markers, // 覆盖物数组
      false, // 动画过渡到制定位置
      [20, 20, 20, 20] // 周围边距，上、下、左、右
    );
  });
};
const handleSub = () => {
  clueStore.addPlace(modelPlace.value);
  window.$message.success('保存成功');
  init();
};
const init = () => {
  const massList = clueStore.placeList.map((m) => ({
    lnglat: [m.location!.lng, m.location!.lat],
    name: m.name,
    id: m.id,
    style: 1,
  }));
  MassMakerRef.value.refresh(massList);
  modelPlace.value = new PlaceFormDTO();
};
defineExpose({
  init,
});
</script>
<style lang="css" scoped>
.form-map {
  height: 400px;
}
</style>
