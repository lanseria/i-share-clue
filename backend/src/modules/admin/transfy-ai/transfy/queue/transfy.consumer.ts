import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { TransfyEntity } from '../transfy.entity';

@Processor('transfy-queue')
export class TransfyConsumer {
  constructor() {}

  @Process('video-cover')
  async videoCover(job: Job<TransfyEntity>) {
    Logger.log('视频封面输出任务', 'TransfyConsumer');
  }

  @Process('video-slice-audio')
  async videoSliceAudio(job: Job<TransfyEntity>) {
    Logger.log('视频音频分割任务', 'TransfyConsumer');
  }

  @Process('audio-rec')
  async audioRec(job: Job<TransfyEntity>) {
    Logger.log('音频识别任务', 'TransfyConsumer');
  }
}
