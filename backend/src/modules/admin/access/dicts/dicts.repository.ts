import { EntityRepository, Repository } from 'typeorm';
import { DictEntity } from './dict.entity';

@EntityRepository(DictEntity)
export class DictsRepository extends Repository<DictEntity> {}
