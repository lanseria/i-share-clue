import { SubtitlesItem } from '../global-enums/subtitles.enum';

//字幕时间戳转换
export function srtTimestamp(seconds: number) {
  let $milliseconds = seconds + 0;

  let $seconds = Math.floor($milliseconds / 1000);
  let $minutes = Math.floor($seconds / 60);
  const $hours = Math.floor($minutes / 60);
  $milliseconds = $milliseconds % 1000;
  $seconds = $seconds % 60;
  $minutes = $minutes % 60;
  return (
    ($hours < 10 ? '0' : '') +
    $hours +
    ':' +
    ($minutes < 10 ? '0' : '') +
    $minutes +
    ':' +
    ($seconds < 10 ? '0' : '') +
    $seconds +
    ',' +
    ($milliseconds < 100 ? '0' : '') +
    ($milliseconds < 10 ? '0' : '') +
    $milliseconds
  );
}
export function makeSubtitleText(index: number, startTime: number, endTime: number, text: string, isLast = false) {
  if (isLast) {
    return `${index}
${srtTimestamp(startTime)} --> ${srtTimestamp(endTime)}
${text}
`;
  }
  const lineStr = `${index}
${srtTimestamp(startTime)} --> ${srtTimestamp(endTime)}
${text}

`;
  return lineStr;
}

export function buildFile(subtitles: SubtitlesItem[]) {
  // 生成 Srt 文件
  let index = 0;
  let srtText = '';
  subtitles.forEach((m, i) => {
    const lineStr = makeSubtitleText(index, m.StartMs, m.EndMs, m.FinalSentence, i + 1 === subtitles.length);
    srtText += lineStr;
    index++;
  });
  return srtText;
}
