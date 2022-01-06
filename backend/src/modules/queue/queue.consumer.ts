import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('transfy')
export class TransfyQueueConsumerSerive {
  @Process('video')
  async consume(job: Job<unknown>) {
    console.log(job.data);
    return;
  }
}
