import { PaginationRequest } from '@common/interfaces';
import { Pagination } from '@helpers';
import { UserEntity } from '@modules/admin/access/users/user.entity';
import { UsersRepository } from '@modules/admin/access/users/users.repository';
import { MinioClientService } from '@modules/minio-client/minio-client.service';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TimeoutError } from 'rxjs';
import { CreateTransfyRequestDto } from './dtos';
import { TransfyProducer } from './queue/transfy.producer';
import { TransfyEntity } from './transfy.entity';
import { TransfyMapper } from './transfy.mapper';
import { TransfyRepository } from './transfy.repository';

@Injectable()
export class TransfyService {
  constructor(
    private minioClientService: MinioClientService,
    private transfyProducer: TransfyProducer,
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
    @InjectRepository(TransfyRepository)
    private transfyRepository: TransfyRepository,
  ) {}
  /**
   * 开始识别录音
   * @param id ID
   * @returns
   */
  public async runRecQueueTask(id: string) {
    let transfyEntity: TransfyEntity;
    let res = null;
    try {
      transfyEntity = await this.transfyRepository.findOne(id);
      if (
        ['to_be_identifying', 'identify_failed'].includes(transfyEntity.status)
      ) {
        transfyEntity.status = 'identifying';
        if (transfyEntity.category === 'audio') {
          res = await this.transfyProducer.runAudioRecTask(transfyEntity);
        }
        if (transfyEntity.category === 'video') {
          res = await this.transfyProducer.runVideoRecTask(transfyEntity);
        }
        if (transfyEntity.category === 'translation') {
          res = await this.transfyProducer.runTranslationRecTask(transfyEntity);
        }
        return res;
      } else {
        throw new BadRequestException();
      }
    } catch (error) {
      Logger.error(error);
      if (error instanceof NotFoundException) {
        throw new NotFoundException();
      } else {
        throw new InternalServerErrorException();
      }
    } finally {
      await this.transfyRepository.save(transfyEntity);
    }
  }
  /**
   * 删除项目
   * @param ids IDs
   */
  public async deleteTransfy(ids: string[]) {
    try {
      await this.transfyRepository.delete(ids);
    } catch (error) {
      Logger.error(error);
      if (error instanceof NotFoundException) {
        throw new NotFoundException();
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
      const TransfyDtos = transfyEntities.map((m) => this.toDto(m));
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
      return this.toDto(transfyEntity);
    } catch (error) {
      Logger.error(error);
      if (error instanceof TimeoutError) {
        throw new RequestTimeoutException();
      } else {
        Logger.warn(error);
        throw new InternalServerErrorException();
      }
    }
  }

  private toDto(entity: TransfyEntity) {
    const dto = TransfyMapper.toDto(entity);
    dto.url = this.minioClientService.getFileUrl(dto.objectName);
    return dto;
  }
}
