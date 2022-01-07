import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { TransfyEntity } from '../transfy.entity';

@Injectable()
export class TransfyProducer {
  constructor(@InjectQueue('transfy-queue') private transfyQueue: Queue) {}

  async runVideoRecTask(entity: TransfyEntity) {
    const videoRecJob = await this.transfyQueue.add('video-rec', entity);
    return [videoRecJob];
  }
  async runAudioRecTask(entity: TransfyEntity) {
    const audioRec = await this.transfyQueue.add('audio-rec', entity);
    return [audioRec];
  }
  async runTranslationRecTask(entity: TransfyEntity) {
    const translationJob = await this.transfyQueue.add(
      'translation-job',
      entity,
    );
    return [translationJob];
  }
}
