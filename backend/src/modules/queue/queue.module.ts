import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TransfyQueueConsumerSerive } from './queue.consumer';
import { QueueProducer } from './queue.producer';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'transfy',
    }),
  ],
  providers: [QueueProducer, TransfyQueueConsumerSerive],
})
export class QueueModule {}
