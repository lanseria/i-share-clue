import { defineStore } from 'pinia';
import AMapLoader from '@amap/amap-jsapi-loader';
import { getMapArea, setMapArea } from '/@/utils/map';

interface AreaAmap {
  id: string;
  name: string;
  path: number[];
  // 0- 封控区 1- 管控区 2- 防范区
  type: number;
}
interface MapState {
  Amap: IObj;
  areaList: AreaAmap[];
}
const AMapClass = await AMapLoader.load({
  //首次调用 load
  key: import.meta.env.VITE_AMAP_KEY, //首次load key为必填
  version: '2.0',
  plugins: ['AMap.Scale', 'AMap.ToolBar', 'AMap.PlaceSearch', 'AMap.Geolocation', 'AMap.PolygonEditor'],
});
const mapRegistry: Map<string, IObj> = new Map();
export const useMapStore = defineStore({
  id: 'map',
  state: (): MapState => ({
    // 设置地图
    Amap: AMapClass,
    areaList: getMapArea(),
  }),
  actions: {
    /**
     * 添加 map 实例
     * @param id 唯一ID
     * @param map map实例
     */
    addMap(id: string, map: IObj) {
      mapRegistry.set(id, map);
    },
    removeMap(id: string) {
      mapRegistry.delete(id);
    },
    getMap(id: string) {
      if (mapRegistry.has(id)) {
        let map = mapRegistry.get(id)!;
        return map;
      } else {
        throw 'map is not ready!';
      }
    },
    addArea(id: string, area: AreaAmap) {
      const idx = this.areaList.findIndex((m) => m.id === id);
      // 如果id存在就替换
      if (idx >= 0) {
        this.areaList[idx] = area;
        setMapArea(this.areaList);
      } else {
        this.areaList.push(area);
        setMapArea(this.areaList);
      }
    },
    clearArea() {
      this.areaList = [];
      setMapArea(this.areaList);
    },
  },
});
