<template>
  <teleport to="#dashboard-map">
    <n-el tag="div" class="myPageTop">
      <table style="width: 100%">
        <tr v-show="searchText">
          <div id="panel"></div>
        </tr>
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
            <n-auto-complete id="tipinput" :options="options" v-model:value="searchText" type="text" placeholder="请输入关键词" clearable />
          </td>
        </tr>
      </table>
    </n-el>
  </teleport>
</template>
<script lang="ts" setup>
import { ref, watchEffect, onMounted, nextTick } from 'vue';
import { NAutoComplete, NEl, NInput, NSpace, NInputNumber } from 'naive-ui';
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
const pageSize = ref(5);
const cityName = ref('杭州');
const options = ref<any[]>([]);
onMounted(() => {
  const map = mapStore.getMap(props.mid);

  watchEffect(() => {
    if (searchText.value === '') {
      nextTick(() => {
        placeSearch.search('');
      });
    }
    //构造地点查询类
    placeSearch = new $Amap.PlaceSearch({
      type: '汽车服务|汽车销售|汽车维修|摩托车服务|餐饮服务|购物服务|生活服务|体育休闲服务|医疗保健服务|住宿服务|风景名胜|商务住宅|政府机构及社会团体|科教文化服务|交通设施服务|金融保险服务|公司企业|道路附属设施|地名地址信息|公共设施',
      pageSize: pageSize.value, // 单页显示结果条数
      pageIndex: 1, // 页码
      city: cityName.value, // 兴趣点城市
      citylimit: true, //是否强制限制在设置的城市内搜索
      map, // 展现结果的地图实例
      panel: 'panel', // 结果列表将在此容器中进行展示。
      autoFitView: false, // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
    });
    placeSearch.search(searchText.value, (status: string, result: any) => {
      // console.log(result);
      options.value =
        result.poiList?.pois.map((m: any) => {
          return {
            label: `${m.name}[${m.address}]`,
            value: m.id,
          };
        }) ?? [];
    });
  });
});
</script>
<style lang="css" scoped>
.myPageTop {
  width: 400px;
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
