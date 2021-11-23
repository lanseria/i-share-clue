export default class MapRegistry {
  registryMaps: Map<string, any> = new Map();

  setMap(mid: string, instance: any) {
    if (!mid) {
      console.warn('The parameter mid cannot be empty');
    }
    if (this.registryMaps.get(mid)) {
      console.warn(`mid: ${mid} already exists in the map registry`);
    } else {
      this.registryMaps.set(mid, instance);
    }
  }

  getMap(mid: string) {
    return this.registryMaps.get(mid);
  }

  delMap(mid: string) {
    if (this.getMap(mid)) {
      this.registryMaps.delete(mid);
    } else {
      console.warn(`No instance of mid: ${mid} found in the map registry`);
    }
  }
}
