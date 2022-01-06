import { PaginationRequest } from '@common/interfaces';
import { Pagination } from '@helpers';
import { UserEntity } from '@modules/admin/access/users/user.entity';
import { UsersRepository } from '@modules/admin/access/users/users.repository';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
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
  /**
   * 删除项目
   * @param ids IDs
   */
  public async deleteTransfy(ids: string[]) {
    try {
      await this.transfyRepository.delete(ids);
    } catch (error) {
      if (error instanceof TimeoutError) {
        throw new RequestTimeoutException();
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
  /**
   * 转译分页
   * @param pagination 分页
   * @returns 分页数据
   */
  public async getTransfyPage(pagination: PaginationRequest) {
    try {
      const [transfyEntities, total] =
        await this.transfyRepository.getTransfysAndCount(pagination);
      const TransfyDtos = await Promise.all(
        transfyEntities.map(TransfyMapper.toDto),
      );
      return Pagination.of(pagination, total, TransfyDtos);
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
   * 创建字幕转译
   * @param transfyFormDto 字幕转译表单
   * @param user 当前用户
   * @returns 创建完的字幕转译表单
   */
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
