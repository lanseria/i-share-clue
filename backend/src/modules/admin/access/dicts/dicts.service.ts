import { DBErrorCode } from '@common/enums';
import { ForeignKeyConflictException } from '@common/exeptions';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TimeoutError } from 'rxjs';
import { DictMapper } from './dicts.mapper';
import { DictsRepository } from './dicts.repository';
import { CreateDictRequestDto } from './dtos/create-dict-request.dto';

@Injectable()
export class DictsService {
  constructor(
    @InjectRepository(DictsRepository)
    private dictsRepository: DictsRepository,
  ) {}

  public async createDict(dictDto: CreateDictRequestDto) {
    try {
      let dictEntity = DictMapper.toCreateEntity(dictDto);
      dictEntity = await this.dictsRepository.save(dictEntity);
      return DictMapper.toDto(dictEntity);
    } catch (error) {
      Logger.error(error);
      if (
        error.code == DBErrorCode.PgForeignKeyConstraintViolation ||
        error.code == DBErrorCode.PgNotNullConstraintViolation
      ) {
        throw new ForeignKeyConflictException();
      }
      if (error instanceof TimeoutError) {
        throw new RequestTimeoutException();
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
