import { defineStore } from 'pinia';
import AMapLoader from '@amap/amap-jsapi-loader';

interface MapState {
  Amap: IObj;
  mapRegistry: Map<string, IObj>;
}
const AMapClass = await AMapLoader.load({
  //首次调用 load
  key: import.meta.env.VITE_AMAP_KEY, //首次load key为必填
  version: '2.0',
  plugins: ['AMap.Scale', 'AMap.ToolBar', 'AMap.PlaceSearch', 'AMap.Geolocation'],
});
export const useMapStore = defineStore({
  id: 'map',
  state: (): MapState => ({
    // 设置地图
    Amap: AMapClass,
    mapRegistry: new Map(),
  }),
  actions: {
    /**
     * 添加 map 实例
     * @param id 唯一ID
     * @param map map实例
     */
    addMap(id: string, map: IObj) {
      this.mapRegistry.set(id, map);
    },
    removeMap(id: string) {
      this.mapRegistry.delete(id);
    },
    getMap(id: string) {
      if (this.mapRegistry.has(id)) {
        let map = this.mapRegistry.get(id)!;
        return map;
      } else {
        throw 'map is not ready!';
      }
    },
  },
});
