import { defineStore } from 'pinia';
import { getSubtitlesReq, updateSubtitleForTransfyReq } from '/@/api/Admin/TransfyAi/Transfy';
import { stringDownload } from '/@/api/File';
import { SubtitlesItem } from '/@/global-enums/subtitles.enum';
import { TransfyDTO } from '/@/types/Admin/Transfy/dto';
import { buildFile } from '/@/utils/transfy';

interface TransfyState {
  transfy: TransfyDTO;
  subtitles: SubtitlesItem[];
  loaded: boolean;
  subtitlesLoading: boolean;
}

export const useTransfyStore = defineStore({
  id: 'transfy',
  state: (): TransfyState => ({
    transfy: new TransfyDTO(),
    subtitles: [],
    loaded: false,
    subtitlesLoading: false,
  }),
  actions: {
    setSubtitles(subtitles: SubtitlesItem[]) {
      this.subtitles = subtitles;
    },
    setTransfy(transfy: TransfyDTO) {
      this.transfy = transfy;
    },
    setLoaded(loaded: boolean) {
      this.loaded = loaded;
    },
    async saveSubtitles() {
      const { payload } = await updateSubtitleForTransfyReq(this.transfy.id, this.subtitles);
      return payload;
    },

    async exportSubtitles() {
      const srtString = buildFile(this.subtitles);
      stringDownload(srtString, `${this.transfy.name}.srt`);
    },
    async loadSubtitles() {
      this.subtitlesLoading = true;
      setTimeout(async () => {
        const res = await getSubtitlesReq(this.transfy.recResJsonUrl);
        this.subtitlesLoading = false;
        this.setSubtitles(
          res.map((m, i) => {
            return {
              ...m,
              id: i + 1,
            };
          })
        );
      }, 1000);
    },
  },
});
