import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TencentService } from './tencent.service';

@Module({
  imports: [ConfigModule],
  providers: [TencentService],
  exports: [TencentService],
})
export class TencentModule {}
