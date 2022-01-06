import { Module } from '@nestjs/common';
import { TransfyModule } from './transfy/transfy.module';

@Module({
  imports: [TransfyModule],
})
export class TransfyAiModule {}
