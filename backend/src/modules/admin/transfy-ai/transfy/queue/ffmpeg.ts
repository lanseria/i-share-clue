import * as path from 'path';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ffmpeg = require('js-ffmpeg');
export class Ffmpeg {
  generateCover(videoPath: string, coverPath: string) {
    return new Promise((resolve, reject) => {
      ffmpeg
        .ffmpeg(
          videoPath,
          [
            '-vf "select=eq(pict_type,I)"',
            '-frames:v 1',
            '-q:v 1',
            '-pix_fmt yuvj422p',
            '-vsync vfr',
            '-f image2',
          ],
          coverPath,
          () => {},
        )
        .success((data: any) => {
          resolve(data);
        })
        .error((error: any) => {
          reject(error);
        });
    });
  }

  extractVideoAudio(videoName: string, audioName?: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const videoPath = path.join(process.cwd(), videoName);
      const filename = path.basename(videoPath);
      if (!filename) {
        throw new Error('错误的文件路径');
      }
      const ext = path.extname(filename);
      const fileN = filename.split(ext)[0];
      const timestamp = (new Date().getTime() / 1000).toFixed(0);
      const tempAudioName = audioName ?? `${fileN}-${timestamp}.aac`;
      ffmpeg
        .ffmpeg(videoPath, ['-vn'], tempAudioName, function (progress: any) {
          console.log(progress);
        })
        .success(function (json: any) {
          console.log('[shell log]: ', json);
          console.log(`音频分离成功 ${tempAudioName}`);
          resolve(tempAudioName);
        })
        .error(function (error: any) {
          reject(error);
        });
    });
  }
}
