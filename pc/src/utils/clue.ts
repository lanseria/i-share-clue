import storage from 'store';

const setCommonList = (v: any[], name: string) => {
  v ? storage.set(name, v) : storage.remove(name);
};
const getCommonList = (name: string) => {
  return storage.get(name, []);
};

export const setRawClueList = (v: any[]) => {
  setCommonList(v, 'RAW_CLUE_LIST');
};

export const getRawClueList = (): any[] => {
  return getCommonList('RAW_CLUE_LIST');
};

export const setThingList = (v: any[]) => {
  setCommonList(v, 'THING_LIST');
};

export const getThingList = (): any[] => {
  return getCommonList('THING_LIST');
};

export const setPlaceList = (v: any[]) => {
  setCommonList(v, 'PLACE_LIST');
};

export const getPlaceList = (): any[] => {
  return getCommonList('PLACE_LIST');
};

export const setTimeList = (v: any[]) => {
  setCommonList(v, 'TIME_LIST');
};

export const getTimeList = (): any[] => {
  return getCommonList('TIME_LIST');
};

export const setEventList = (v: any[]) => {
  setCommonList(v, 'EVENT_LIST');
};

export const getEventList = (): any[] => {
  return getCommonList('EVENT_LIST');
};
