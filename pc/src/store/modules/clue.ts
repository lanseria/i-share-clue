import { defineStore } from 'pinia';
import { CommonDTO } from '/@/types/Common/dto';
import { nanoid } from 'nanoid';
import {
  getEventList,
  getPlaceList,
  getRawClueList,
  getThingList,
  getTimeList,
  setEventList,
  setPlaceList,
  setRawClueList,
  setThingList,
  setTimeList,
} from '/@/utils/clue';
import { ProjectLocation } from '/@/types/Admin/Clue/Project/dto';
export class SplitData {
  flag = '';
  word = '';
}
export class RawClueFormDTO extends CommonDTO {
  /**
   * 唯一ID
   */
  id = '';
  /**
   * 数据名称
   */
  name = '';
  /**
   * 元数据
   */
  metadata = '';
  /**
   * 修正数据
   */
  correctdata = '';
  /**
   * 分词数据
   */
  splitdata: SplitData[] = [];
  constructor(row?: RawClueFormDTO) {
    super();
    this.id = row?.id || nanoid();
    this.name = row?.name || '';
    this.metadata = row?.metadata || '';
    this.correctdata = row?.correctdata || '';
    this.splitdata = row?.splitdata || [];
  }
  initData() {
    this.correctdata = this.metadata;
  }
}
export class ThingFormDTO extends CommonDTO {
  metadata = '';
  id = '';
  no = '';
  house = '';
  sex = '';
  age = '';
  work = '';
  traffic = '';
  end = null;
  constructor(row?: any) {
    super();
    this.id = row?.id || nanoid();
    if (row) this.mergeProperties(row);
  }
}
export class PlaceFormDTO extends CommonDTO {
  metadata = '';
  id = '';
  name = '';
  location: ProjectLocation | null = null;
  pv = 0;
  uv = 0;
  constructor(row?: any) {
    super();
    this.id = row?.id || nanoid();
    if (row) this.mergeProperties(row);
  }
}
export class TimeFormDTO extends CommonDTO {
  metadata = '';
  id = '';
  value: number | null = null;
  constructor(row?: any) {
    super();
    this.id = row?.id || nanoid();
    if (row) this.mergeProperties(row);
  }
}
export class EventFormDTO extends CommonDTO {
  metadata = '';
  id = '';
  user = '';
  place = '';
  time: number | null = null;
  constructor(row?: any) {
    super();
    this.id = row?.id || nanoid();
    if (row) this.mergeProperties(row);
  }
}
interface ClueState {
  rawClueList: RawClueFormDTO[];
  thingList: ThingFormDTO[];
  placeList: PlaceFormDTO[];
  timeList: TimeFormDTO[];
  eventList: EventFormDTO[];
}

export const useClueStore = defineStore({
  id: 'clue',
  state: (): ClueState => ({
    rawClueList: getRawClueList(),
    thingList: getThingList(),
    placeList: getPlaceList(),
    timeList: getTimeList(),
    eventList: getEventList(),
  }),
  actions: {
    addRawClue(row: RawClueFormDTO) {
      const idx = this.rawClueList.findIndex((m) => m.id === row.id);
      if (idx >= 0) {
        this.rawClueList[idx] = row;
      } else {
        this.rawClueList.push(row);
      }
      setRawClueList(this.rawClueList);
    },
    delRawCLue(row: RawClueFormDTO) {
      this.rawClueList = this.rawClueList.filter((m) => m.id !== row.id);
      setRawClueList(this.rawClueList);
    },

    addThing(row: ThingFormDTO) {
      const idx = this.thingList.findIndex((m) => m.id === row.id);
      if (idx >= 0) {
        this.thingList[idx] = row;
      } else {
        this.thingList.push(row);
      }
      setThingList(this.thingList);
    },
    delThing(row: ThingFormDTO) {
      this.thingList = this.thingList.filter((m) => m.id !== row.id);
      setThingList(this.thingList);
    },

    addPlace(row: PlaceFormDTO) {
      const idx = this.placeList.findIndex((m) => m.id === row.id);
      if (idx >= 0) {
        this.placeList[idx] = row;
      } else {
        this.placeList.push(row);
      }
      setPlaceList(this.placeList);
    },
    delPlace(row: ThingFormDTO) {
      this.placeList = this.placeList.filter((m) => m.id !== row.id);
      setPlaceList(this.placeList);
    },

    addTime(row: TimeFormDTO) {
      const idx = this.timeList.findIndex((m) => m.id === row.id);
      if (idx >= 0) {
        this.timeList[idx] = row;
      } else {
        this.timeList.push(row);
      }
      setTimeList(this.timeList);
    },
    delTime(row: TimeFormDTO) {
      this.timeList = this.timeList.filter((m) => m.id !== row.id);
      setTimeList(this.timeList);
    },

    addEvent(row: EventFormDTO) {
      const idx = this.eventList.findIndex((m) => m.id === row.id);
      if (idx >= 0) {
        this.eventList[idx] = row;
      } else {
        this.eventList.push(row);
      }
      setEventList(this.eventList);
    },
    delEvent(row: EventFormDTO) {
      this.eventList = this.eventList.filter((m) => m.id !== row.id);
      setEventList(this.eventList);
    },
  },
});
