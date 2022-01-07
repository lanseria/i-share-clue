import { Logger } from '@nestjs/common';
import { exec } from 'child_process';
import * as path from 'path';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ffmpeg = require('js-ffmpeg');
export class Ffmpeg {
  static generateCover(videoPath: string): Promise<string> {
    const coverPath = `${videoPath}.jpg`;
    return new Promise((resolve, reject) => {
      exec(
        `ffmpeg -i ${videoPath} -vf "select=eq(pict_type\\,I)" -vf scale=320:180 -frames:v 1 -q:v 1 -pix_fmt yuvj422p -vsync vfr -f image2  ${coverPath} -hide_banner -loglevel error`,
        (err, stdout: string, stderr: string) => {
          if (err) {
            reject(err);
          }
          resolve(coverPath);
        },
      );
    });
  }

  static extractVideoAudio(videoPath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const filename = path.basename(videoPath);
      if (!filename) {
        throw new Error('错误的文件路径');
      }
      const audioPath = `${videoPath}.aac`;
      ffmpeg
        .ffmpeg(videoPath, ['-vn'], audioPath, function (progress: any) {
          Logger.log(progress, '音频分离中');
        })
        .success(function (json: any) {
          Logger.log(`${audioPath}`, '音频分离成功');
          resolve(audioPath);
        })
        .error(function (error: any) {
          reject(error);
        });
    });
  }
}
