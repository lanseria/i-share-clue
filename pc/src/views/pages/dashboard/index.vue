<template>
  <n-spin :show="mapLoading">
    <div class="map-wrap" id="dashboard-map">
      <Amap
        :mid="DASHBOARD_MAP"
        @rightclick="clickHandler"
        @location-complete="onAmapComplete"
        @movestart="onMoveStart"
        @mapmove="onMapMove"
        @moveend="onMoveEnd"
      >
        <PlaceSearch :mid="DASHBOARD_MAP"></PlaceSearch>
        <RightDropdown ref="RightDropdownRef" @add-msg="handleAddMsg"></RightDropdown>
        <CircleMarker
          :mid="DASHBOARD_MAP"
          v-for="marker in markerList"
          :key="marker.mid"
          :location="marker.location"
          :ext-data="marker"
          @click="handleMarkerClick"
        ></CircleMarker>
        <InfoWindow :mid="DASHBOARD_MAP" ref="InfoWindowRef"></InfoWindow>
      </Amap>
    </div>
  </n-spin>
  <QuickFormModal ref="QuickFormModalRef" @load-page="loadPage()"></QuickFormModal>
</template>
<script lang="ts">
import { NSpin, NEl } from 'naive-ui';
import { defineComponent, onMounted, ref, nextTick, watchEffect, watch } from 'vue';
import { searchAreaProjectsReq } from '/@/api/Admin/Clue/Project';
import QuickFormModal from '/@/views/pages/clue/Project/QuickFormModal.vue';
import { PlaceSearch, Amap, CircleMarker, InfoWindow } from '/@/views/pages/clue/Project/Map';
import RightDropdown from './RightDropdown.vue';
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
    NSpin,
    NEl,
    QuickFormModal,
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
    const mapMovingStartFlag = ref(false);
    const mapMoving = ref(false);
    const mapLoading = ref(false);
    // refs
    const RightDropdownRef = ref();
    const QuickFormModalRef = ref();
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
      QuickFormModalRef.value.open({
        location: {
          lng: lnglat?.lng,
          lat: lnglat?.lat,
        },
      });
    };

    const handleMarkerClick = (e: any) => {
      // TODO: 暂时这么做
      const iW = {
        title: e.extData.name,
        desc: e.extData.desc,
      };
      const { lng, lat } = e.extData.location;
      InfoWindowRef.value.open(lng, lat, iW);
    };
    const debounceLoadPage = (time: number = 500) => {
      return debounce(async (e) => {
        console.log('debounceLoadPage');
      }, time);
    };
    // const onResize = debounceLoadPage(1000);
    // const onZoomend = debounceLoadPage(1000);
    const onMoveStart = () => {
      if (!mapLoading.value) {
        mapMovingStartFlag.value = true;
      }
    };
    const onMapMove = () => {
      if (!mapLoading.value && mapMovingStartFlag.value) {
        mapMoving.value = true;
      }
    };
    const onMoveEnd = () => {
      mapMoving.value = false;
    };

    const onAmapComplete = (e: any) => {
      // console.log(e);
      loadPage();
      const debounceLoad = debounce(() => {
        mapLoading.value = true;
        loadPage().then(() => {
          mapLoading.value = false;
        });
      }, 1000);
      setTimeout(() => {
        watch(mapMoving, (next, prev) => {
          if (prev === true && next === false) {
            debounceLoad();
          }
        });
      }, 1000);
    };

    const loadPage = async () => {
      let map = mapStore.getMap(DASHBOARD_MAP);
      const bounds = map.getBounds();
      const { payload } = await searchAreaProjectsReq(bounds);
      markerList.value = payload;
    };

    return {
      // const
      DASHBOARD_MAP,
      // ref
      markerList,
      mapLoading,
      // refs
      RightDropdownRef,
      QuickFormModalRef,
      InfoWindowRef,

      // method
      loadPage,
      handleAddMsg,
      handleMapClick,
      clickHandler,
      onAmapComplete,
      // onResize,
      // onZoomend,
      onMoveStart,
      onMapMove,
      onMoveEnd,
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
