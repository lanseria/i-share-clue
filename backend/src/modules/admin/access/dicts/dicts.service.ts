import { PaginationResponseDto } from '@common/dtos';
import { DBErrorCode } from '@common/enums';
import { ForeignKeyConflictException } from '@common/exeptions';
import { PaginationRequest } from '@common/interfaces';
import { Pagination } from '@helpers';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TimeoutError } from 'rxjs';
import { DictMapper } from './dicts.mapper';
import { DictsRepository } from './dicts.repository';
import { CreateDictRequestDto } from './dtos/create-dict-request.dto';
import { DictResponseDto } from './dtos/dict-response.dto';
import { UpdateDictRequestDto } from './dtos/update-dict-request.dto';

@Injectable()
export class DictsService {
  constructor(
    @InjectRepository(DictsRepository)
    private dictsRepository: DictsRepository,
  ) {}
  /**
   * 删除字典
   * @param ids
   * @returns
   */
  public async deleteDict(ids: string[]) {
    try {
      await this.dictsRepository.delete(ids);
      return true;
    } catch (error) {
      if (error instanceof TimeoutError) {
        throw new RequestTimeoutException();
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
  /**
   * 更新字典
   * @param dictDto
   * @returns
   */
  public async updateDict(dictDto: UpdateDictRequestDto) {
    let dictEntity = await this.dictsRepository.findOne(dictDto.id);
    if (!dictEntity) {
      throw new NotFoundException();
    }
    try {
      dictEntity = DictMapper.toUpdateEntity(dictEntity, dictDto);
      dictEntity = await this.dictsRepository.save(dictEntity);
      return DictMapper.toDto(dictEntity);
    } catch (error) {
      // if (error.code == DBErrorCode.PgUniqueConstraintViolation) {
      //   throw new UserExistsException(userDto.username);
      // }
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
  /**
   * 获取字典分页
   * @param pagination 分页
   */
  public async getDicts(
    pagination: PaginationRequest,
  ): Promise<PaginationResponseDto<DictResponseDto>> {
    try {
      const [dictEntities, totolDicts] =
        await this.dictsRepository.getDictsAndCount(pagination);
      const DictDtos = await Promise.all(dictEntities.map(DictMapper.toDto));
      return Pagination.of(pagination, totolDicts, DictDtos);
    } catch (error) {
      Logger.error(error);
      if (error instanceof NotFoundException) {
        throw new NotFoundException();
      }
      if (error instanceof TimeoutError) {
        throw new RequestTimeoutException();
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
  /**
   * 创建字典
   * @param dictDto 字典Dto
   * @returns
   */
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
