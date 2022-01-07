import { UsersRepository } from '@modules/admin/access/users/users.repository';
import { MinioClientModule } from '@modules/minio-client/minio-client.module';
import { TencentModule } from '@modules/tencent/tencent.module';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransfyConsumer } from './queue/transfy.consumer';
import { TransfyProducer } from './queue/transfy.producer';
import { TransfyController } from './transfy.controller';
import { TransfyMapper } from './transfy.mapper';
import { TransfyRepository } from './transfy.repository';
import { TransfyService } from './transfy.service';

@Module({
  imports: [
    MinioClientModule,
    TencentModule,
    TypeOrmModule.forFeature([UsersRepository, TransfyRepository]),
    BullModule.registerQueue({ name: 'transfy-queue' }),
  ],
  controllers: [TransfyController],
  providers: [TransfyService, TransfyProducer, TransfyConsumer, TransfyMapper],
})
export class TransfyModule {}
