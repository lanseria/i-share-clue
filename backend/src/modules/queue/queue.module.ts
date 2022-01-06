import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TransfyQueueConsumerSerive } from './queue.consumer';
import { QueueProducerService } from './queue.producer.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'transfy',
    }),
  ],
  providers: [QueueProducerService, TransfyQueueConsumerSerive],
})
export class QueueModule {}
