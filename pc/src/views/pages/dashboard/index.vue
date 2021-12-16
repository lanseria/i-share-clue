<template>
  <div class="map-wrap" id="dashboard-map">
    <Amap @rightclick="clickHandler" @location-complete="onAmapComplete" @resize="debounceLoadPage" @zoomend="debounceLoadPage" @moveend="debounceLoadPage">
      <PlaceSearch></PlaceSearch>
      <RightDropdown ref="RightDropdownRef" @add-msg="handleAddMsg"></RightDropdown>
      <CircleMarker v-for="marker in markerList" :key="marker.id" :location="marker.location" :ext-data="marker" @click="handleMarkerClick"></CircleMarker>
      <InfoWindow ref="InfoWindowRef">
        <div style="max-width: 500px; min-width: 200px">
          <p>{{ iW.title }}</p>
          <p>{{ iW.desc }}</p>
        </div>
      </InfoWindow>
    </Amap>
  </div>
  <form-modal ref="FormModalRef" @load-page="loadPage()"></form-modal>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref, nextTick } from 'vue';
import { searchAreaProjectsReq } from '/@/api/Admin/Clue/Project';
import FormModal from './FormModal.vue';
import PlaceSearch from './PlaceSearch.vue';
import RightDropdown from './RightDropdown.vue';
import Amap from './Amap.vue';
import CircleMarker from './CircleMarker.vue';
import InfoWindow from './InfoWindow.vue';
import { debounce } from 'lodash';
import { useMapStore } from '/@/store/modules/map';
import { DASHBOARD_MAP } from './const';
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
    InfoWindow,
  },
  setup() {
    const mapStore = useMapStore();
    //
    let lnglat: LngLat | undefined = undefined;
    let markerList = ref<any[]>([]);
    const iW = ref({
      title: '',
      desc: '',
    });
    // refs
    const RightDropdownRef = ref();
    const FormModalRef = ref();
    const InfoWindowRef = ref();
    const handleMapClick = () => {};
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
      // TODO: 暂时这么做
      iW.value.title = e.extData.name;
      iW.value.desc = e.extData.desc;
      InfoWindowRef.value.open(e.extData.location.lng, e.extData.location.lat);
    };

    const debounceLoadPage = debounce(function (event) {
      loadPage();
    }, 1500);

    const onAmapComplete = (e: any) => {
      loadPage();
    };

    const loadPage = async () => {
      let map = mapStore.getMap(DASHBOARD_MAP);
      const bounds = map.getBounds();
      const { payload } = await searchAreaProjectsReq(bounds);
      markerList.value = payload;
    };

    onMounted(() => {});

    return {
      // ref
      markerList,
      iW,
      // refs
      RightDropdownRef,
      FormModalRef,
      InfoWindowRef,

      // method
      loadPage,
      handleAddMsg,
      handleMapClick,
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
