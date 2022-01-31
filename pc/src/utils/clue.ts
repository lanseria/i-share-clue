import storage from 'store';

export const setRawClueList = (v: any[]) => {
  v ? storage.set('RAW_CLUE_LIST', v) : storage.remove('RAW_CLUE_LIST');
};

export const getRawClueList = (): any[] => {
  return storage.get('RAW_CLUE_LIST', []);
};
