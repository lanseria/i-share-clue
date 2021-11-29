import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DictsController } from './dicts.controller';
import { DictsRepository } from './dicts.repository';
import { DictsService } from './dicts.service';

@Module({
  imports: [TypeOrmModule.forFeature([DictsRepository])],
  controllers: [DictsController],
  providers: [DictsService],
})
export class DictsModule {}
