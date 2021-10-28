import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectRepository } from './project.repository';
import { UsersRepository } from '@modules/admin/access/users/users.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectRepository, UsersRepository])],
  providers: [ProjectService],
  controllers: [ProjectController],
})
export class ProjectModule {}
