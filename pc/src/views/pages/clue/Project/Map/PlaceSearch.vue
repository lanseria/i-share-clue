<template>
  <teleport to="#dashboard-map">
    <n-el tag="div" class="myPageTop">
      <table style="width: 100%">
        <tr style="width: 100%">
          <td style="width: 100%">
            <n-space align="center">
              <label>请输入关键字：</label>
              <n-input size="small" style="width: 100px" v-model:value="cityName" placeholder="城市名"></n-input>
              <n-input-number size="small" style="width: 80px" v-model:value="pageSize" placeholder="每页"></n-input-number>
            </n-space>
          </td>
        </tr>
        <tr style="width: 100%">
          <td style="width: 100%">
            <n-space>
              <n-input v-model:value="searchText" type="text" placeholder="请输入关键词" :on-clear="clearSearch()" clearable />
              <n-button @click="search()">搜索</n-button>
            </n-space>
          </td>
        </tr>
      </table>
    </n-el>
  </teleport>
</template>
<script lang="ts" setup>
import { shallowRef } from 'vue';
import { NEl, NInput, NSpace, NInputNumber, NButton } from 'naive-ui';
import { useMapStore } from '/@/store/modules/map';
import { nanoid } from 'nanoid';
const props = defineProps({
  mid: {
    type: String,
    default: nanoid(),
  },
});
// global
const mapStore = useMapStore();
const $Amap = mapStore.Amap;
let placeSearch: any = null;
// ref
const searchText = shallowRef('');
const pageSize = shallowRef(5);
const cityName = shallowRef('杭州');
const options = shallowRef<any[]>([]);
const map = mapStore.getMap(props.mid);
let markers: any[] = [];
//构造地点查询类
placeSearch = new $Amap.PlaceSearch({
  pageSize: pageSize.value, // 单页显示结果条数
  pageIndex: 1, // 页码
  city: cityName.value, // 兴趣点城市
  citylimit: true, //是否强制限制在设置的城市内搜索
});
const setConfig = () => {
  placeSearch.setPageSize(pageSize.value);
  placeSearch.setCity(cityName.value);
};
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
  setConfig();
  if (searchText.value === '') {
    clearSearch();
  } else {
    clearSearch();
    placeSearch.searchInBounds(searchText.value, map.getBounds(), (status: string, result: any) => {
      // 查询成功时，result即对应匹配的POI信息
      console.log(result);
      const pois = result.poiList.pois;
      for (var i = 0; i < pois.length; i++) {
        const poi = pois[i];
        markers[i] = new $Amap.Marker({
          position: poi.location, // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
          title: poi.name,
        });
        // 将创建的点标记添加到已有的地图实例：
        map.add(markers[i]);
      }
      map.setFitView(
        markers, // 覆盖物数组
        false, // 动画过渡到制定位置
        [200, 200, 200, 200] // 周围边距，上、下、左、右
      );
    });
  }
};
</script>
<style lang="css" scoped>
.myPageTop {
  width: 400px;
  position: absolute;
  top: 5px;
  right: 10px;
  font-size: 14px;
  background-color: var(--base-color);
  border-radius: 0.4rem;
  border-image: initial;
  margin: 10px auto;
  padding: 6px;
  z-index: 1;
}
.myPageTop label {
  margin: 0 20px 0 0;
  color: #666666;
  font-weight: normal;
}
.myPageTop #tipinput {
  width: 100%;
}
#panel :deep(.amap_lib_placeSearch),
#panel :deep(.amap_lib_placeSearch_list) {
  background-color: var(--base-color);
  color: var(--text-color-1);
}
#panel :deep(.poibox:hover),
#panel :deep(.poibox.active) {
  background-color: var(--hover-color);
  color: var(--primary-color-hover);
}
</style>
