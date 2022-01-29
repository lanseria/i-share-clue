<template>
  <div class="map-wrap" id="dashboard-map">
    <Amap :mid="DASHBOARD_MAP" @rightclick="clickHandler" @location-complete="loadPage()">
      <PlaceSearch :mid="DASHBOARD_MAP"></PlaceSearch>
      <RightDropdown ref="RightDropdownRef" @add-msg="handleAddMsg" @add-area="handleAddArea" @refresh="loadPage()"></RightDropdown>
      <MassMarker ref="MassMakerRef" :mid="DASHBOARD_MAP" @click="handleMassClick"></MassMarker>
      <InfoWindow :mid="DASHBOARD_MAP" ref="InfoWindowRef"></InfoWindow>
      <Polygon :mid="DASHBOARD_MAP" ref="PolygonRef"></Polygon>
    </Amap>
  </div>
  <QuickFormModal ref="QuickFormModalRef" @load-page="loadPage()"></QuickFormModal>
</template>
<script lang="ts" setup>
import { ref, nextTick, shallowRef } from 'vue';
import { getProjectById, searchAreaProjectsReq } from '/@/api/Admin/Clue/Project';
import QuickFormModal from '/@/views/pages/clue/Project/QuickFormModal.vue';
import { PlaceSearch, Amap, InfoWindow, MassMarker, Polygon } from '/@/views/pages/clue/Project/Map';
import RightDropdown from './RightDropdown.vue';
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

const mapStore = useMapStore();
//
let lnglat: LngLat | undefined = undefined;
// refs
const RightDropdownRef = shallowRef();
const QuickFormModalRef = shallowRef();
const InfoWindowRef = shallowRef();
const MassMakerRef = shallowRef();
const PolygonRef = shallowRef();
// const handleMapClick = () => {};
const clickHandler = (e: any) => {
  RightDropdownRef.value.close();
  nextTick().then(() => {
    RightDropdownRef.value.open(e);
    lnglat = new LngLat(e.lnglat);
  });
};

const handleAddMsg = (key: string) => {
  RightDropdownRef.value.close();
  QuickFormModalRef.value.add({
    location: {
      lng: lnglat?.lng,
      lat: lnglat?.lat,
    },
  });
};

const handleMassClick = async (row: any) => {
  const form = await getProjectById(row.id);
  QuickFormModalRef.value.edit(form);
};
const handleAddArea = () => {
  PolygonRef.value.createPolygon();
};

const loadPage = async () => {
  let map = mapStore.getMap(DASHBOARD_MAP);
  const bounds = map.getBounds();
  const { payload } = await searchAreaProjectsReq(bounds);
  const massList = payload.map((m) => ({
    lnglat: [m.location.lng, m.location.lat],
    name: m.name,
    id: m.id,
    style: +m.category - 1,
  }));
  MassMakerRef.value.refresh(massList);
};
</script>
<style lang="css" scoped>
.map-wrap {
  position: relative;
  height: calc(100vh - 64px);
}
</style>
