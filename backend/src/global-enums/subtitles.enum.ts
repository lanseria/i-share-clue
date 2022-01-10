export interface SliceItem {
  FinalSentence: string;
  StartMs: number;
  EndMs: number;
}

export interface SubtitlesItem extends SliceItem {
  id: number;
}
