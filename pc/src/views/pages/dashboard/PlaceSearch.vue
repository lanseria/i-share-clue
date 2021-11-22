<template>
  <div class="myPageTop">
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
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, watchEffect, onMounted, getCurrentInstance, inject } from 'vue';
import { NAutoComplete } from 'naive-ui';
export default defineComponent({
  components: {
    NAutoComplete,
  },
  setup() {
    const { $Amap } = getCurrentInstance()!.appContext.config.globalProperties;
    const map = inject<any>('map');
    let placeSearch: any = null;
    // ref
    const searchText = ref('');
    const options = ref<any[]>([]);
    onMounted(() => {
      $Amap.plugin('AMap.PlaceSearch', function () {
        //构造地点查询类
        placeSearch = new $Amap.PlaceSearch({
          pageSize: 5, // 单页显示结果条数
          pageIndex: 1, // 页码
          // city: '', // 兴趣点城市
          citylimit: true, //是否强制限制在设置的城市内搜索
          map: map, // 展现结果的地图实例
          autoFitView: true, // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
        });
      });

      watchEffect(() => {
        placeSearch.search(searchText.value, (status: string, result: any) => {
          console.log(result);
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
    return {
      options,
      searchText,
    };
  },
});
</script>
<style lang="css" scoped>
.myPageTop {
  position: absolute;
  top: 5px;
  right: 10px;
  font-size: 14px;
  background-color: var(--color);
  border-width: 1px;
  border-style: solid;
  border-color: rgb(204, 204, 204);
  border-image: initial;
  margin: 10px auto;
  padding: 6px;
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
