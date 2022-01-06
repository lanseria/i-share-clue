import { UsersRepository } from '@modules/admin/access/users/users.repository';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransfyController } from './transfy.controller';
import { TransfyRepository } from './transfy.repository';
import { TransfyService } from './transfy.service';

@Module({
  imports: [TypeOrmModule.forFeature([UsersRepository, TransfyRepository])],
  controllers: [TransfyController],
  providers: [TransfyService],
})
export class TransfyModule {}
