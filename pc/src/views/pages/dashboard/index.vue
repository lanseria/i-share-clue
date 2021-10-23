<template>
  <div id="container" tabindex="0"></div>
</template>
<script lang="ts">
import { defineComponent, onMounted } from "vue";
import AMapLoader from "@amap/amap-jsapi-loader";
export default defineComponent({
  setup() {
    onMounted(async () => {
      const AMap = await AMapLoader.load({
        //首次调用 load
        key: import.meta.env.VITE_AMAP_KEY, //首次load key为必填
        version: "2.0",
        plugins: ["AMap.Scale", "AMap.ToolBar"]
      });
      const map = new AMap.Map("container", {
        resizeEnable: true, //是否监控地图容器尺寸变化
        zoom: 17, //初始地图级别
        pitch: 75, // 地图俯仰角度，有效范围 0 度- 83 度
        viewMode: "3D" // 地图模式
      });
      map.addControl(new AMap.Scale());
      map.addControl(new AMap.ToolBar());
      map.add(
        new AMap.Marker({
          position: map.getCenter()
        })
      );
    });
    return {};
  }
});
</script>
<style lang="css" scoped>
#container {
  height: calc(100vh - 64px);
}
</style>
