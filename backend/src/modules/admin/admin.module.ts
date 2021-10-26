import { Module } from '@nestjs/common';
import { AccessModule } from './access/access.module';
import { ClueModule } from './clue/clue.module';

@Module({
  imports: [AccessModule, ClueModule],
})
export class AdminModule {}
