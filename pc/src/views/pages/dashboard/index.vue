<template>
  <div class="map-wrap">
    <Amap @rightclick="clickHandler" @location-complete="onAmapComplete" @resize="debounceLoadPage" @zoomend="debounceLoadPage" @moveend="debounceLoadPage">
      <PlaceSearch></PlaceSearch>
      <RightDropdown ref="RightDropdownRef" @add-msg="handleAddMsg"></RightDropdown>
      <CircleMarker v-for="marker in markerList" :key="marker.id" :location="marker.location" :ext-data="marker" @click="handleMarkerClick"></CircleMarker>
    </Amap>
  </div>
  <form-modal ref="FormModalRef" @load-page="loadPage()"></form-modal>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref, getCurrentInstance, nextTick, provide } from 'vue';
import FormModal from './FormModal.vue';
import PlaceSearch from './PlaceSearch.vue';
import RightDropdown from './RightDropdown.vue';
import Amap from './Amap.vue';
import CircleMarker from './CircleMarker.vue';
import { searchAreaProjectsReq } from '/@/api/Admin/Clue/Project';
import { debounce } from 'lodash';
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
    FormModal,
    PlaceSearch,
    RightDropdown,
    Amap,
    CircleMarker,
  },
  setup() {
    const { $Amap } = getCurrentInstance()!.appContext.config.globalProperties;
    //
    let infoWindow: any = undefined;
    let lnglat: LngLat | undefined = undefined;
    let markerList = ref<any[]>([]);
    let map: any = null;
    // refs
    const RightDropdownRef = ref();
    const FormModalRef = ref();

    const clickHandler = (e: any) => {
      RightDropdownRef.value.close();
      nextTick().then(() => {
        RightDropdownRef.value.open(e);
        lnglat = new LngLat(e.lnglat);
      });
    };

    const handleAddMsg = (key: string) => {
      RightDropdownRef.value.close();
      FormModalRef.value.open({
        location: {
          lng: lnglat?.lng,
          lat: lnglat?.lat,
        },
      });
    };

    const handleMarkerClick = (e: any) => {
      infoWindow.open(map, [e.extData.location.lng, e.extData.location.lat]);
    };

    const debounceLoadPage = debounce(function (event) {
      loadPage();
    }, 1500);

    const onAmapComplete = (e: any) => {
      map = e.map.value;
      loadPage();
    };

    const loadPage = async () => {
      const bounds = map.getBounds();
      const { payload } = await searchAreaProjectsReq(bounds);
      markerList.value = payload;
    };
    const showMap = () => {
      //构建信息窗体中显示的内容
      let info = [];
      info.push(
        '<div class=\'input-card content-window-card\'><div><img style="float:left;width:67px;height:16px;" src=" https://webapi.amap.com/images/autonavi.png "/></div> '
      );
      info.push('<div style="padding:7px 0px 0px 0px;"><h4>高德软件</h4>');
      info.push("<p class='input-item'>电话 : 010-84107000   邮编 : 100102</p>");
      info.push("<p class='input-item'>地址 :北京市朝阳区望京阜荣街10号首开广场4层</p></div></div>");

      infoWindow = new $Amap.InfoWindow({
        content: info.join(''), //使用默认信息窗体框样式，显示信息内容
      });
    };
    onMounted(async () => {
      showMap();
    });

    return {
      // ref
      markerList,
      // refs
      RightDropdownRef,
      FormModalRef,

      // method
      loadPage,
      handleAddMsg,
      clickHandler,
      onAmapComplete,
      debounceLoadPage,
      handleMarkerClick,
    };
  },
});
</script>
<style lang="css" scoped>
.map-wrap {
  position: relative;
  height: calc(100vh - 64px);
}
</style>
