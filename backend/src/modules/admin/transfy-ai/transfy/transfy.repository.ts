import { EntityRepository, Repository } from 'typeorm';
import { TransfyEntity } from './transfy.entity';

@EntityRepository(TransfyEntity)
export class TransfyRepository extends Repository<TransfyEntity> {}
