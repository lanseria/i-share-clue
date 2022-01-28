import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectRepository } from './project.repository';
import { UsersRepository } from '@modules/admin/access/users/users.repository';
import { MinioClientModule } from '@modules/minio-client/minio-client.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersRepository, ProjectRepository]),
    MinioClientModule,
  ],
  providers: [ProjectService],
  controllers: [ProjectController],
})
export class ProjectModule {}
