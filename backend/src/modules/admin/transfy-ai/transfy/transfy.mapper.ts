import { UserEntity } from '@modules/admin/access/users/user.entity';
import { UserMapper } from '@modules/admin/access/users/users.mapper';
import { Logger } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { CreateTransfyRequestDto, TransfyResponseDto } from './dtos';
import { TransfyEntity } from './transfy.entity';

export class TransfyMapper {
  public static toSetDefaultPoster(entity: TransfyEntity) {
    const genPosterUrl = (name: string) => {
      return `https://transfy.cloud.tencent.com/static/media/${name}.svg`;
    };
    if (entity.category === 'video') {
      entity.poster = genPosterUrl('list_video.278456ad');
    } else if (entity.category === 'audio') {
      entity.poster = genPosterUrl('list_audio.fd009eef');
    } else if (entity.category === 'translation') {
      entity.poster = genPosterUrl('list_subtitle.89ebeea8');
    } else {
      Logger.log(JSON.stringify(entity));
      throw new Error('没有找到对应的转译类型');
    }
    return entity;
  }
  public static toCreateEntity(
    dto: CreateTransfyRequestDto,
    user: UserEntity,
  ): TransfyEntity {
    const entity = new TransfyEntity();
    entity.name = dto.name;
    entity.objectName = dto.objectName;
    entity.category = dto.category;
    entity.engineModel = dto.engineModel;
    entity.creator = user;
    return entity;
  }

  public static toDto(entity: TransfyEntity) {
    const dto = new TransfyResponseDto();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.objectName = entity.objectName;
    dto.category = entity.category;
    dto.status = entity.status;
    dto.poster = entity.poster;
    dto.creator = UserMapper.toDto(entity.creator);
    dto.createdAt = dayjs(entity.createdAt).unix();
    dto.updatedAt = dayjs(entity.updatedAt).unix();
    return dto;
  }
}
