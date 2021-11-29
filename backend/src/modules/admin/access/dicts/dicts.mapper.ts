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
    return dto;
  }

  public static toCreateEntity(dto: CreateDictRequestDto): DictEntity {
    const entity = new DictEntity();
    entity.name = dto.name;
    entity.value = dto.value;
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
