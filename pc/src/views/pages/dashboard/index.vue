<template>
  <div class="map-wrap">
    <div id="container" tabindex="0"></div>

    <div id="myPageTop">
      <table>
        <tr>
          <td>
            <label>请输入关键字：</label>
          </td>
        </tr>
        <tr>
          <td>
            <n-auto-complete
              id="tipinput"
              :options="options"
              v-model:value="searchText"
              type="text"
              placeholder="请输入关键词"
              clearable
            />
          </td>
        </tr>
      </table>
    </div>
    <n-dropdown
      placement="bottom-start"
      @select="handleSelect"
      trigger="manual"
      :x="x"
      :y="y"
      :options="ddOptions"
      :show="showDropdown"
      :on-clickoutside="onClickoutside"
    />
  </div>
  <form-modal ref="FormModalRef" @load-page="loadPage()"></form-modal>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref, watchEffect, nextTick } from "vue";
import AMapLoader from "@amap/amap-jsapi-loader";
import { NAutoComplete, NDropdown, useMessage } from "naive-ui";
import FormModal from "./FormModal.vue";
class LngLat {
  KL = 122.10714947486878;
  kT = 30.029054686576302;
  lat = 30.029055;
  lng = 122.107149;
  pos = [13592905.701760534, 3507285.0995366885];

  constructor(that: LngLat) {
    this.KL = that.KL;
    this.kT = that.kT;
    this.lat = that.lat;
    this.lng = that.lng;
    this.pos = that.pos;
  }
}
export default defineComponent({
  components: {
    NAutoComplete,
    NDropdown,
    FormModal
  },
  setup() {
    const message = useMessage();
    // global
    const ddOptions = [
      {
        label: "添加信息",
        key: "add-msg"
      }
    ];
    let AMap: any = undefined;
    let map: any = undefined;
    let lnglat: LngLat | undefined = undefined;
    // ref
    const searchText = ref("");

    // refs
    const FormModalRef = ref();
    const showDropdownRef = ref(false);
    // ref
    const xRef = ref(0);
    const yRef = ref(0);

    const options = ref<any[]>([]);
    const clickHandler = (e: any) => {
      showDropdownRef.value = false;
      nextTick().then(() => {
        showDropdownRef.value = true;
        xRef.value = e.originEvent.clientX;
        yRef.value = e.originEvent.clientY;
        lnglat = new LngLat(e.lnglat);
      });
    };
    const handleSelect = (key: string) => {
      showDropdownRef.value = false;
      message.info(key);
      if (key === "add-msg") {
        FormModalRef.value.open({
          location: {
            lng: lnglat?.lng,
            lat: lnglat?.lat
          }
        });
      }
    };

    const onClickoutside = (e: MouseEvent) => {
      showDropdownRef.value = false;
    };
    const loadPage = () => {
      //
    };
    onMounted(async () => {
      AMap = await AMapLoader.load({
        //首次调用 load
        key: import.meta.env.VITE_AMAP_KEY, //首次load key为必填
        version: "2.0",
        plugins: ["AMap.Scale", "AMap.ToolBar"]
      });
      map = new AMap.Map("container", {
        resizeEnable: true, //是否监控地图容器尺寸变化
        zoom: 17, //初始地图级别
        pitch: 75, // 地图俯仰角度，有效范围 0 度- 83 度
        viewMode: "2D", // 地图模式
        mapStyle: "amap://styles/dark", //设置地图的显示样式
        features: ["bg", "road", "building", "point"]
      });
      map.on("rightclick", clickHandler);
      watchEffect(() => {
        AMap.plugin(["AMap.PlaceSearch"], function () {
          //构造地点查询类
          var placeSearch = new AMap.PlaceSearch({
            pageSize: 5, // 单页显示结果条数
            pageIndex: 1, // 页码
            city: "舟山", // 兴趣点城市
            citylimit: true, //是否强制限制在设置的城市内搜索
            map: map, // 展现结果的地图实例
            autoFitView: true // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
          });
          //关键字查询
          placeSearch.search(
            searchText.value,
            (status: string, result: any) => {
              console.log(result);
              options.value =
                result.poiList?.pois.map((m: any) => {
                  return {
                    label: m.name,
                    value: m.id
                  };
                }) ?? [];
            }
          );
        });
      });
      AMap.plugin("AMap.Geolocation", function () {
        var geolocation = new AMap.Geolocation({
          // 是否使用高精度定位，默认：true
          enableHighAccuracy: true,
          // 设置定位超时时间，默认：无穷大
          timeout: 10000,
          //  定位按钮的排放位置,  RB表示右下
          buttonPosition: "RB",
          // 定位按钮的停靠位置的偏移量，默认：Pixel(10, 20)
          // buttonOffset: new AMap.Pixel(-100, -100),
          //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
          zoomToAccuracy: true
        });
        map.addControl(geolocation);
        geolocation.getCurrentPosition(function (status: any, result: any) {
          if (status == "complete") {
            onComplete(result);
          } else {
            onError(result);
          }
        });

        function onComplete(data: any) {
          console.log(data);
          // data是具体的定位信息
        }

        function onError(data: any) {
          console.log(data);
          // 定位出错
        }
      });

      // //创建右键菜单
      // const contextMenu = new AMap.ContextMenu();
      // let contextMenuPositon = "";
      // //右键添加Marker标记
      // contextMenu.addItem(
      //   "添加标记",
      //   function (e: any) {
      //     var marker = new AMap.Marker({
      //       map: map,
      //       position: contextMenuPositon //基点位置
      //     });
      //   },
      //   3
      // );

      // //地图绑定鼠标右击事件——弹出右键菜单
      // map.on("rightclick", function (e) {
      //   contextMenu.open(map, e.lnglat);
      //   contextMenuPositon = e.lnglat;
      // });
    });

    return {
      // refs
      FormModalRef,
      showDropdown: showDropdownRef,

      searchText,
      options,
      ddOptions,
      x: xRef,
      y: yRef,
      // method
      loadPage,
      handleSelect,
      onClickoutside
    };
  }
});
</script>
<style lang="css" scoped>
.map-wrap {
  position: relative;
  height: calc(100vh - 64px);
}
#container {
  position: absolute;
  width: 100%;
  height: 100%;
}
#myPageTop {
  position: absolute;
  top: 5px;
  right: 10px;
  font-family: "Microsoft Yahei", ΢���ź�, Pinghei;
  font-size: 14px;
  background-color: var(--color);
  border-width: 1px;
  border-style: solid;
  border-color: rgb(204, 204, 204);
  border-image: initial;
  margin: 10px auto;
  padding: 6px;
}
#myPageTop label {
  margin: 0 20px 0 0;
  color: #666666;
  font-weight: normal;
}
#myPageTop input {
  width: 270px;
}
.map-wrap :deep(.amap-content-body) {
  background-color: var(--color);
}
.map-wrap :deep(.amap-lib-infowindow-title) {
  background-color: var(--color);
}
.map-wrap :deep(.amap-lib-infowindow-content) {
  background-color: var(--color);
}
.map-wrap :deep(.amap-menu-outer) {
  background-color: var(--color);
}
.map-wrap :deep(.amap-menu-outer li:hover) {
  background-color: var(--color);
}
</style>
