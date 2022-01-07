import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { TransfyEntity } from '../transfy.entity';

@Injectable()
export class TransfyProducer {
  constructor(@InjectQueue('transfy-queue') private transfyQueue: Queue) {}

  async runVideoRecTask(entity: TransfyEntity) {
    const videoCoverJob = await this.transfyQueue.add('video-cover', entity);
    const videoSliceAudio = await this.transfyQueue.add(
      'video-slice-audio',
      entity,
    );
    const audioRec = await this.transfyQueue.add('audio-rec', entity);
    return [videoCoverJob, videoSliceAudio, audioRec];
  }
  async runAudioRecTask(entity: TransfyEntity) {
    const audioRec = await this.transfyQueue.add('audio-rec', entity);
    return [audioRec];
  }
  async runTranslationRecTask(entity: TransfyEntity) {
    return await this.transfyQueue.add('translation-job', entity);
  }
}
