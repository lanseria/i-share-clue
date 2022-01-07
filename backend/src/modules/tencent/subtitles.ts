import { utilCwdPath } from 'src/helpers/read';
import {
  SentenceDetail,
  SentenceWords,
  TaskStatus,
} from 'tencentcloud-sdk-nodejs/tencentcloud/services/asr/v20190614/asr_models';
import {
  getTextBlock,
  getTextBlocks,
  makeSubtitleText,
  replaceStrs,
} from '../../helpers/str';

interface SliceItem {
  FinalSentence: string;
  StartMs: number;
  EndMs: number;
}

interface FormatSliceItem {
  FinalSentence: string;
  FormatText: string;
  StartMs: number;
  EndMs: number;
  Blocks: number[];
  TextBlocks: string[];
  IsEmptyBlock: boolean;
  Words: SentenceWords[];
}

export class Subtitles {
  private rawData: TaskStatus;
  private sliceData: SliceItem[];
  constructor(rawJsonPath = 'config/descResult.json') {
    this.rawData = require(utilCwdPath(rawJsonPath));
    this.sliceData = [];
  }

  fillSliceData(Row: SliceItem) {
    this.sliceData.push(Row);
  }

  formatPg(Pg: SentenceDetail): FormatSliceItem {
    const FormatText = replaceStrs(Pg.FinalSentence);
    const Blocks = getTextBlock(Pg.FinalSentence);
    const TextBlocks = getTextBlocks(Pg.FinalSentence);
    const IsEmptyBlock = [0, 1].includes(Blocks.length);
    return {
      ...Pg,
      FormatText,
      Blocks,
      TextBlocks,
      IsEmptyBlock,
    };
  }

  useBlockFindLastWord(Fpg: FormatSliceItem, Words: SentenceWords[]) {
    for (let i = 0; i < Fpg.Blocks.length; i++) {
      let w = undefined;
      let blockBeginTime = Fpg.StartMs;
      let first = true;
      const text = Fpg.TextBlocks[i];
      while ((w = Words.shift())) {
        if (first) {
          first = false;
          blockBeginTime = blockBeginTime + w.OffsetStartMs;
        }
        if (text.endsWith(w.Word.trim())) {
          this.fillSliceData({
            FinalSentence: text,
            StartMs: blockBeginTime,
            EndMs: Fpg.StartMs + w.OffsetEndMs,
          });
          first = true;
          break;
        }
      }
    }
  }

  anylsisPg(Pg: SentenceDetail) {
    const FormatPg = this.formatPg(Pg);
    if (FormatPg.IsEmptyBlock) {
      this.fillSliceData({
        FinalSentence: FormatPg.FinalSentence,
        StartMs: FormatPg.StartMs,
        EndMs: FormatPg.EndMs,
      });
    } else {
      const { Words } = FormatPg;
      this.useBlockFindLastWord(FormatPg, Words);
    }
  }

  buildSliceData() {
    const ResultDetail = this.rawData.ResultDetail;
    ResultDetail.forEach((Pg) => {
      this.anylsisPg(Pg);
    });
    return this.sliceData;
  }

  buildFile() {
    // 生成 Srt 文件
    let index = 0;
    let srtText = '';
    this.sliceData.forEach((m, i) => {
      const lineStr = makeSubtitleText(
        index,
        m.StartMs,
        m.EndMs,
        m.FinalSentence,
        i + 1 === this.sliceData.length,
      );
      srtText += lineStr;
      index++;
    });
    return srtText;
  }
}
