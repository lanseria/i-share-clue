import { UserEntity } from '@modules/admin/access/users/user.entity';
import { UsersRepository } from '@modules/admin/access/users/users.repository';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TimeoutError } from 'rxjs';
import { CreateTransfyRequestDto } from './dtos';
import { TransfyMapper } from './transfy.mapper';
import { TransfyRepository } from './transfy.repository';

@Injectable()
export class TransfyService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
    @InjectRepository(TransfyRepository)
    private transfyRepository: TransfyRepository,
  ) {}

  public async createTransfy(
    transfyFormDto: CreateTransfyRequestDto,
    user: UserEntity,
  ) {
    try {
      user = await this.usersRepository.findOne(user.id);
      let transfyEntity = TransfyMapper.toCreateEntity(transfyFormDto, user);
      transfyEntity = TransfyMapper.toSetDefaultPoster(transfyEntity);
      transfyEntity = await this.transfyRepository.save(transfyEntity);
      return TransfyMapper.toDto(transfyEntity);
    } catch (error) {
      if (error instanceof TimeoutError) {
        throw new RequestTimeoutException();
      } else {
        Logger.warn(error);
        throw new InternalServerErrorException();
      }
    }
  }
}
