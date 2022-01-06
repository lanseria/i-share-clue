import { UserEntity } from '@modules/admin/access/users/user.entity';
import { UsersRepository } from '@modules/admin/access/users/users.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTransfyRequestDto } from './dtos';
import { TransfyRepository } from './transfy.repository';

@Injectable()
export class TransfyService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
    @InjectRepository(TransfyRepository)
    private transfyRepository: TransfyRepository,
  ) {}

  createTransfy(transfyFormDto: CreateTransfyRequestDto, user: UserEntity) {
    throw new Error('Method not implemented.');
  }
}
