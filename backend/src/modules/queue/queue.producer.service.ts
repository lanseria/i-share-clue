import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class QueueProducerService {
  constructor(@InjectQueue('transfy') private transfyQueue: Queue) {}

  async sendVideo(message: string) {
    await this.transfyQueue.add('video');
  }
}
