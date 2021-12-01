import { ResponseTreeDto } from '@common/dtos/response.dto';
import { DictEntity } from './dict.entity';
import { CreateDictRequestDto } from './dtos/create-dict-request.dto';
import { DictResponseDto } from './dtos/dict-response.dto';
import { UpdateDictRequestDto } from './dtos/update-dict-request.dto';

export class DictMapper {
  public static toDto(entity: DictEntity): DictResponseDto {
    const dto = new DictResponseDto();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.value = entity.value;
    dto.parentId = entity.parentId;
    return dto;
  }

  public static toTreeDto(entity: DictEntity): ResponseTreeDto {
    return {
      key: entity.id,
      label: entity.name,
      children: entity.children.length
        ? entity.children.map((m) => this.toTreeDto(m))
        : null,
    };
  }

  public static async toCreateEntity(
    dto: CreateDictRequestDto,
    getParent: (dto: CreateDictRequestDto) => Promise<DictEntity>,
  ): Promise<DictEntity> {
    const entity = new DictEntity();
    entity.name = dto.name;
    entity.value = dto.value;
    entity.parent = await getParent(dto);
    return entity;
  }

  public static toUpdateEntity(
    entity: DictEntity,
    dto: Partial<UpdateDictRequestDto>,
  ): DictEntity {
    entity.name = dto.name;
    entity.value = dto.value;
    return entity;
  }
}
