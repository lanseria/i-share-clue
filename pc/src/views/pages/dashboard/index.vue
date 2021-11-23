<template>
  <div class="map-wrap">
    <Amap></Amap>
    <!-- <div id="container" tabindex="0"></div> -->

    <PlaceSearch></PlaceSearch>
    <RightDropdown ref="RightDropdownRef" @add-msg="handleAddMsg"></RightDropdown>
  </div>
  <form-modal ref="FormModalRef" @load-page="loadPage()"></form-modal>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref, getCurrentInstance, nextTick, provide } from 'vue';
import FormModal from './FormModal.vue';
import PlaceSearch from './PlaceSearch.vue';
import RightDropdown from './RightDropdown.vue';
import Amap from './Amap.vue';
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
  },
  setup() {
    const { $Amap } = getCurrentInstance()!.appContext.config.globalProperties;
    //
    let infoWindow: any = undefined;
    let lnglat: LngLat | undefined = undefined;
    let markerList: any[] = [];
    let map: any = undefined;
    provide('map', map);

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

    const debounceLoadPage = debounce(function (event) {
      loadPage();
    }, 1500);

    const loadPage = async () => {
      var bounds = map.getBounds();
      const { payload } = await searchAreaProjectsReq(bounds);
      markerList.map((marker) => {
        map.remove(marker);
      });
      markerList = payload.map((m) => {
        const marker = new $Amap.CircleMarker({
          center: new $Amap.LngLat(m.location.lng, m.location.lat),
          radius: 10, //3D视图下，CircleMarker半径不要超过64px
          strokeColor: 'white',
          strokeWeight: 2,
          strokeOpacity: 0.5,
          fillColor: 'rgba(0,0,255,1)',
          fillOpacity: 0.5,
          zIndex: 10,
          bubble: true,
          cursor: 'pointer',
          clickable: true,
          extData: m,
        });
        marker.on('click', function (e: any) {
          const extData = e.target.getExtData();
          console.log(extData);
          infoWindow.open(map, [extData.location.lng, extData.location.lat]);
        });
        return marker;
      });
      markerList.map((marker) => {
        map.add(marker);
      });
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
    onMounted(async () => {});

    return {
      // refs
      RightDropdownRef,
      FormModalRef,

      // method
      loadPage,
      handleAddMsg,
    };
  },
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
.map-wrap :deep(.amap-content-body),
.map-wrap :deep(.amap-lib-infowindow-title),
.map-wrap :deep(.amap-lib-infowindow-content),
.map-wrap :deep(.amap-menu-outer),
.map-wrap :deep(.amap-info-content),
.map-wrap :deep(.amap-menu-outer li:hover) {
  background-color: var(--color);
}
.map-wrap :deep(.amap-info-sharp) {
  border-top: 8px solid var(--color);
}
</style>
