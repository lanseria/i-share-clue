import storage from 'store';

export const setMapArea = (v: any[]) => {
  v ? storage.set('MAP_AREA', v) : storage.remove('MAP_AREA');
};

export const getMapArea = (): any[] => {
  return storage.get('MAP_AREA', []);
};
