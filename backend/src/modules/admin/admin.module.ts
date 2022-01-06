import { Module } from '@nestjs/common';
import { AccessModule } from './access/access.module';
import { ClueModule } from './clue/clue.module';
import { TransfyAiModule } from './transfy-ai/transfy-ai.module';

@Module({
  imports: [AccessModule, ClueModule, TransfyAiModule],
})
export class AdminModule {}
