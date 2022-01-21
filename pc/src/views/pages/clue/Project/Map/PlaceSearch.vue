<template>
  <teleport to="#dashboard-map">
    <n-el tag="div" class="myPageTop">
      <table>
        <tr>
          <td>
            <label>请输入关键字：</label>
          </td>
        </tr>
        <tr>
          <td>
            <n-auto-complete id="tipinput" :options="options" v-model:value="searchText" type="text" placeholder="请输入关键词" clearable />
          </td>
        </tr>
      </table>
    </n-el>
  </teleport>
</template>
<script lang="ts" setup>
import { defineComponent, ref, watchEffect, onMounted } from 'vue';
import { NAutoComplete, NEl } from 'naive-ui';
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
const searchText = ref('');
const options = ref<any[]>([]);
onMounted(() => {
  const map = mapStore.getMap(props.mid);
  //构造地点查询类
  placeSearch = new $Amap.PlaceSearch({
    pageSize: 5, // 单页显示结果条数
    pageIndex: 1, // 页码
    city: '杭州', // 兴趣点城市
    citylimit: true, //是否强制限制在设置的城市内搜索
    map, // 展现结果的地图实例
    autoFitView: true, // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
  });

  watchEffect(() => {
    placeSearch.search(searchText.value, (status: string, result: any) => {
      // console.log(result);
      options.value =
        result.poiList?.pois.map((m: any) => {
          return {
            label: m.name,
            value: m.id,
          };
        }) ?? [];
    });
  });
});
</script>
<style lang="css" scoped>
.myPageTop {
  position: absolute;
  top: 5px;
  right: 10px;
  font-size: 14px;
  background-color: var(--base-color);
  border-width: 1px;
  border-style: solid;
  border-color: rgb(204, 204, 204);
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
.myPageTop input {
  width: 270px;
}
</style>
