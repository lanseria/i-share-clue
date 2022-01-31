import { defineStore } from 'pinia';
import { CommonDTO } from '/@/types/Common/dto';
import { nanoid } from 'nanoid';
import { getRawClueList, setRawClueList } from '/@/utils/clue';
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

interface ClueState {
  rawClueList: RawClueFormDTO[];
}

export const useClueStore = defineStore({
  id: 'clue',
  state: (): ClueState => ({
    rawClueList: getRawClueList(),
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
  },
});
